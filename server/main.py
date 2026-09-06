from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
try:
    from routes.health import router as health_router
    from routes.agent import router as agent_router
except ImportError:
    from server.routes.health import router as health_router
    from server.routes.agent import router as agent_router

app = FastAPI()

dev_url = os.getenv("DEV_URL", "")
allow_origins = [
    "https://aryxenv.dev",
    "https://www.aryxenv.dev",
    "www.aryxenv.dev",
]
if dev_url:
    allow_origins.append(dev_url)

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