import os
import uuid
import base64
import asyncio
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List, Dict, Any
from dotenv import load_dotenv
from langchain_anthropic import ChatAnthropic
from browser_use import Agent
from browser_use.browser.views import BrowserStateSummary
from browser_use.agent.views import AgentOutput
import logging
from playwright.async_api import async_playwright
import subprocess
from fastapi.responses import FileResponse
from tools.tools import WebTool

# logging setup - rushed hackathon style
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# env vars
load_dotenv()

# pics storage - quick setup
IMG_STORE = "session_screenshots"
os.makedirs(IMG_STORE, exist_ok=True)

# fastapi app init
app = FastAPI()

# cors config - allow all for dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# data models - basic stuff
class JobRequest(BaseModel):
    job: str
    ctx: Dict[str, Any] = {}


class JobResponse(BaseModel):
    output: str
    state: str
    pics: list[str]


def make_ai():
    return ChatAnthropic(
        model_name="claude-3-5-sonnet-20240620",
        temperature=0.0,
        timeout=100,
        anthropic_api_key=os.getenv("ANTHROPIC_API_KEY"),
    )


async def test_browser():
    try:
        async with async_playwright() as p:
            br = await p.chromium.launch()
            await br.close()
        return True
    except Exception as e:
        logger.error(f"browser test fail: {str(e)}")
        return False


async def setup_browser():
    try:
        logger.info("installing browsers...")
        subprocess.run(["playwright", "install", "chromium"], check=True)
        logger.info("browsers ready")
        return True
    except Exception as e:
        logger.error(f"browser install fail: {str(e)}")
        return False


async def snap_pic(page, sess_id, step, desc=""):
    sess_path = os.path.join(IMG_STORE, sess_id)
    os.makedirs(sess_path, exist_ok=True)
    fname = f"step_{step}.jpg"
    fpath = os.path.join(sess_path, fname)
    await page.screenshot(path=fpath, type="jpeg", quality=80)
    return f"/session_screenshots/{sess_id}/{fname}"


async def run_bot_with_pics(bot, page, sess_id):
    print("running bot with pics")
    pics = []
    counter = {"count": 0}
    # initial pic - blank page
    pics.append(
        await snap_pic(
            page, sess_id, counter["count"], "start"
        )
    )
    counter["count"] += 1
    # goto url if exists
    if hasattr(bot, "start_url") and bot.start_url:
        await page.goto(bot.start_url)
        pics.append(
            await snap_pic(
                page, sess_id, counter["count"], "after_goto"
            )
        )
        counter["count"] += 1
    # run bot and snap final pic
    result = await bot.run()
    pics.append(
        await snap_pic(
            page, sess_id, counter["count"], "done"
        )
    )
    return result, pics


@app.post("/do_job", response_model=JobResponse)
async def do_job(req: JobRequest):
    try:
        logger.info(f"got job: {req.job}")
        if not await test_browser():
            logger.info("no browser, installing...")
            if not await setup_browser():
                raise HTTPException(
                    status_code=500, detail="browser install failed"
                )
        sess_id = str(uuid.uuid4())
        async with async_playwright() as p:
            br = await p.chromium.launch(headless=False)
            ctx = await br.new_context()
            pg = await ctx.new_page()
            ai = make_ai()
            bot = Agent(task=req.job, llm=ai, context=req.ctx)
            result, pic_urls = await run_bot_with_pics(
                bot, pg, sess_id
            )
            result_str = str(result)
            await ctx.close()
            await br.close()
        return JobResponse(
            output=result_str, state="success", pics=pic_urls
        )
    except Exception as e:
        logger.error(f"job failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# static file serving
app.mount(
    "/session_screenshots",
    StaticFiles(directory=IMG_STORE),
    name="session_screenshots",
)
app.mount("/static", StaticFiles(directory="static"), name="static")


@app.get("/")
async def home():
    return FileResponse("static/index.html")


def b64_to_img(b64_str: str, out_file: str):
    if not os.path.exists(os.path.dirname(out_file)):
        os.makedirs(os.path.dirname(out_file))
    img_data = base64.b64decode(b64_str)
    with open(out_file, "wb") as f:
        f.write(img_data)
    return out_file


@app.websocket("/ws/bot")
async def bot_ws(ws: WebSocket):
    tool = WebTool()
    await tool._arun(job="", ctx={}, websocket=ws)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
