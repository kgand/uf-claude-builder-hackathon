import os
import uuid
from typing import Dict, Any
from langchain.tools import BaseTool
from browser_use import Agent
from langchain_anthropic import ChatAnthropic
from browser_use.browser.views import BrowserStateSummary
from browser_use.agent.views import AgentOutput
from dotenv import load_dotenv
import anthropic
import json
import asyncio
import base64
from fastapi import WebSocket, WebSocketDisconnect

load_dotenv()

# pic storage dir
PIC_DIR = "session_screenshots"
os.makedirs(PIC_DIR, exist_ok=True)


def b64_to_img(b64_str: str, out_file: str):
    if not os.path.exists(os.path.dirname(out_file)):
        os.makedirs(os.path.dirname(out_file))
    img_data = base64.b64decode(b64_str)
    with open(out_file, "wb") as f:
        f.write(img_data)
    return out_file


class WebTool(BaseTool):
    name: str = "web_bot"
    description: str = (
        "browser tool for web tasks - navigation and interaction"
    )

    async def _arun(
        self, job: str, ctx: Dict[str, Any] = None, websocket: WebSocket = None
    ) -> Dict[str, Any]:
        await websocket.accept()
        try:
            # get job and ctx from frontend
            data = await websocket.receive_json()
            job = data.get("task")
            ctx = data.get("context", {})
            sess_id = str(uuid.uuid4())
            step_count = 0
            # use claude directly
            llm = ChatAnthropic(model="claude-3-7-sonnet-20250219")
            pic_urls = []

            # step callback - snap pics
            def step_cb(
                state: BrowserStateSummary, model_output: AgentOutput, steps: int
            ):
                nonlocal step_count
                path = f"{PIC_DIR}/{sess_id}/step_{step_count}.png"
                last_pic = state.screenshot
                img_path = b64_to_img(str(last_pic), path)
                pic_url = (
                    f"/session_screenshots/{sess_id}/step_{step_count}.png"
                )
                pic_urls.append(pic_url)
                # get memory info
                status = getattr(
                    getattr(model_output, "current_state", None), "memory", ""
                )
                step_count += 1

                # send pic to frontend
                asyncio.create_task(
                    websocket.send_json(
                        {
                            "screenshot_url": pic_url,
                            "screenshot_base64": str(last_pic),
                            "step": step_count,
                            "status": status,
                        }
                    )
                )

            # run the bot
            bot = Agent(
                task=job,
                llm=llm,
                context=ctx,
                register_new_step_callback=step_cb,
            )
            result = await bot.run()
            # send final result
            await websocket.send_json(
                {
                    "result": str(result),
                    "status": "success",
                    "screenshot_urls": pic_urls,
                    "done": True,
                }
            )
        except WebSocketDisconnect:
            pass
        except Exception as e:
            await websocket.send_json({"error": str(e)})
            raise

    def _run(self, job: str, ctx: Dict[str, Any] = None) -> Dict[str, Any]:
        raise NotImplementedError("WebTool is async only")


class DirectAITool:
    """direct claude api - no browser needed"""

    name = "direct_ai"
    description = "ai tool for text tasks - no browser"

    async def run(self, job: str, ctx: Dict[str, Any] = None) -> Dict[str, Any]:
        # anthropic client
        client = anthropic.AsyncAnthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

        # prompt setup
        prompt = f"""
        helpful ai assistant - accurate answers.
        
        context: {json.dumps(ctx) if ctx else "{}"}
        
        job: {job}
        
        respond based on job and context.
        """

        # direct claude call
        response = await client.messages.create(
            model="claude-3-7-sonnet-20250219",
            max_tokens=4096,
            temperature=0,
            system="helpful ai assistant - accurate answers.",
            messages=[
                {
                    "role": "user",
                    "content": f"{prompt}",
                }
            ],
        )

        return {
            "result": response.content[0].text,
            "screenshot_urls": [],
            "tool_used": "direct_ai",
        }
