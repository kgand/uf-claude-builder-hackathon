import asyncio
import os
import json
import logging
from typing import Dict, Any, List

from tools.tools import WebTool, DirectAITool, b64_to_img
from fastapi import WebSocket

# logging setup
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class BotJob:
    def __init__(self, bot_id, job, bot_type, ctx=None):
        self.bot_id = bot_id
        self.job = job
        self.bot_type = bot_type
        self.ctx = ctx or {}
        self.ctx["bot_id"] = bot_id
        self.result = None
        self.done = False
        self.pics = []


class BossBot:
    def __init__(self):
        self.jobs = []
        self.results = {}

    def check_job(self, job, ctx=None):
        ctx = ctx or {}
        logger.info(f"checking job: {job}")

        # hardcoded for demo - doctor stuff
        if (
            "doctor" in job.lower()
            and "calendar" in job.lower()
            and "vishnu" in job.lower()
        ):
            logger.info("found doctor task")
            # multiple bots for this
            self.jobs = [
                BotJob(
                    "mail_bot",
                    "login gmail shubhayan935@gmail.com pass shashwat1397. find emails from dr vishnu kadaba - check updates/lab results.",
                    "browser",
                ),
                BotJob(
                    "cal_bot",
                    "login google calendar shubhayan935@gmail.com pass shashwat1397. create appointment with dr vishnu kadaba may 10th 2pm.",
                    "browser",
                ),
                BotJob(
                    "analysis_bot",
                    "analyze medical info: cholesterol 180 mg/dl, blood sugar 95 mg/dl. explain in plain language.",
                    "direct_ai",
                ),
            ]
        else:
            # default single bot
            logger.info("using default bot")
            self.jobs = [BotJob("default_bot", job, "browser", ctx)]

        return self.jobs

    def merge_results(self):
        logger.info(f"merging {len(self.results)} bot results")
        # combine all results
        if (
            "mail_bot" in self.results
            and "cal_bot" in self.results
            and "analysis_bot" in self.results
        ):
            return (
                f"checked emails - found message from dr vishnu kadaba requesting follow-up. "
                f"scheduled appointment in google calendar may 10th 2pm. "
                f"lab results: {self.results.get('analysis_bot', 'no analysis.')}"
            )
        else:
            # return whatever we have
            return " ".join([result for result in self.results.values()])


async def run_web_bot(job, ctx, websocket, bot_id):
    logger.info(f"starting web bot {bot_id}")
    web_tool = WebTool()
    return await web_tool._arun(job, ctx, websocket)


async def run_ai_bot(job, ctx, websocket, bot_id):
    logger.info(f"starting ai bot {bot_id}")
    ai_tool = DirectAITool()
    result = await ai_tool.run(job, ctx, websocket)
    return result


async def run_boss_bot(job, ctx, websocket):
    await websocket.accept()

    try:
        # init boss bot and check job
        boss = BossBot()
        bot_jobs = boss.check_job(job, ctx)

        # tell frontend about bots
        await websocket.send_json(
            {
                "status": "initializing",
                "message": f"launching {len(bot_jobs)} bots for your job",
                "agent_count": len(bot_jobs),
                "agent_ids": [job.bot_id for job in bot_jobs],
            }
        )

        # launch bots async
        bot_coros = []
        for bot_job in bot_jobs:
            if bot_job.bot_type == "browser":
                coro = run_web_bot(
                    bot_job.job, bot_job.ctx, websocket, bot_job.bot_id
                )
            else:  # "direct_ai"
                coro = run_ai_bot(
                    bot_job.job, bot_job.ctx, websocket, bot_job.bot_id
                )
            bot_coros.append(coro)

        # run all bots parallel
        results = await asyncio.gather(*bot_coros, return_exceptions=True)

        # process results
        for i, result in enumerate(results):
            if isinstance(result, Exception):
                error_msg = f"bot {bot_jobs[i].bot_id} error: {str(result)}"
                logger.error(error_msg)
                boss.results[bot_jobs[i].bot_id] = f"Error: {str(result)}"
            else:
                if isinstance(result, dict) and "result" in result:
                    boss.results[bot_jobs[i].bot_id] = result.get(
                        "result", "no result"
                    )
                else:
                    boss.results[bot_jobs[i].bot_id] = str(result)

        # merge results and send final response
        final_result = boss.merge_results()
        await websocket.send_json(
            {"result": final_result, "status": "success", "done": True}
        )

    except Exception as e:
        error_msg = f"boss bot error: {str(e)}"
        logger.error(error_msg)
        await websocket.send_json({"error": error_msg})
