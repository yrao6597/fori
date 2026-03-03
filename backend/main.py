from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from dotenv import load_dotenv
import anthropic
import os

from prompt import SYSTEM_PROMPT, build_user_prompt

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))


class PathRequest(BaseModel):
    goal: str
    level: str
    what_hasnt_worked: str
    time_per_day: str


@app.post("/generate-path")
def generate_path(request: PathRequest):
    user_prompt = build_user_prompt(
        goal=request.goal,
        level=request.level,
        what_hasnt_worked=request.what_hasnt_worked,
        time_per_day=request.time_per_day,
    )

    def stream():
        with client.messages.stream(
            model="claude-sonnet-4-20250514",
            max_tokens=4096,
            system=SYSTEM_PROMPT,
            messages=[{"role": "user", "content": user_prompt}],
        ) as stream:
            for text in stream.text_stream:
                yield text

    return StreamingResponse(stream(), media_type="text/plain")
