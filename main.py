from fastapi import FastAPI, Request
from mcrcon import MCRcon
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI()

RCON_HOST = os.getenv("RCON_HOST")
RCON_PORT = os.getenv("RCON_PORT")
RCON_PASS = os.getenv("RCON_PASS")


def run_rcon(command: str):
    with MCRcon(RCON_HOST, RCON_PASS, port=RCON_PORT) as mcr:
        return mcr.command(command)


@app.post("/whitelist/add")
async def add_whitelist(request: Request):
    data = await request.json()
    username = data.get("username")
    if not username:
        return {"status": "error", "message": "username missing"}
    resp = run_rcon(f"whitelist add {username}")
    return {"status": "success", "username": username, "response": resp}


@app.post("/whitelist/remove")
async def remove_whitelist(request: Request):
    data = await request.json()
    username = data.get("username")
    if not username:
        return {"status": "error", "message": "username missing"}
    resp = run_rcon(f"whitelist remove {username}")
    return {"status": "success", "username": username, "response": resp}
