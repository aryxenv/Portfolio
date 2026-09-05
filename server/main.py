from fastapi import FastAPI
try:
    from routes.health import router as health_router
    from routes.agent import router as agent_router
except ImportError:
    from server.routes.health import router as health_router
    from server.routes.agent import router as agent_router

app = FastAPI()
app.include_router(health_router)
app.include_router(agent_router)


@app.get("/")
async def root():
    return {"message": "why are you here"}