from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env from current directory or server directory
env_file = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=env_file)
load_dotenv()  # also check root .env if present

try:
    from routes.health import router as health_router
    from routes.agent import router as agent_router
except ImportError:
    from server.routes.health import router as health_router
    from server.routes.agent import router as agent_router

app = FastAPI()

dev_url = os.getenv("DEV_URL", "").strip()
allow_origins = [
    "https://aryxenv.dev",
    "https://www.aryxenv.dev",
]

# In local development, inject dev origin(s) from .env via DEV_URL
if dev_url:
    for origin in dev_url.split(","):
        clean_origin = origin.strip().strip('"').strip("'").rstrip("/")
        if clean_origin and clean_origin not in allow_origins:
            allow_origins.append(clean_origin)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-Session-ID", "Retry-After"],
)

app.include_router(health_router)
app.include_router(agent_router)


@app.get("/")
async def root():
    return {"message": "why are you here"}