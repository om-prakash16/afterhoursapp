from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routes import auth, chat, companion, memory, vision, analytics, dna, signals, onboarding, emotions, leaderboard, risk, portfolio, notifications, admin, gamification, providers, market, sandbox, dashboard, journal, social, fraud, diversification, psychology, replay, agents, explainability, performance, stability_leaderboard
from app.core.database import engine, Base
from app.core.rate_limit import RateLimitMiddleware

app = FastAPI(
    title=settings.APP_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    debug=settings.DEBUG
)

# Set up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(RateLimitMiddleware, requests_per_minute=100)

# Include Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(chat.router, prefix=settings.API_V1_STR)
app.include_router(companion.router, prefix=settings.API_V1_STR)
app.include_router(memory.router, prefix=settings.API_V1_STR)
app.include_router(vision.router, prefix=settings.API_V1_STR)
app.include_router(analytics.router, prefix=settings.API_V1_STR)
app.include_router(dna.router, prefix=settings.API_V1_STR)
app.include_router(onboarding.router, prefix=settings.API_V1_STR)
app.include_router(signals.router, prefix=settings.API_V1_STR)
app.include_router(emotions.router, prefix=settings.API_V1_STR)
app.include_router(leaderboard.router, prefix=settings.API_V1_STR)
app.include_router(risk.router, prefix=settings.API_V1_STR)
app.include_router(portfolio.router, prefix=settings.API_V1_STR)
app.include_router(notifications.router, prefix=settings.API_V1_STR)
app.include_router(admin.router, prefix=settings.API_V1_STR)
app.include_router(gamification.router, prefix=settings.API_V1_STR)
app.include_router(providers.router, prefix=settings.API_V1_STR)
app.include_router(market.router, prefix=settings.API_V1_STR)
app.include_router(sandbox.router, prefix=settings.API_V1_STR)
app.include_router(dashboard.router, prefix=settings.API_V1_STR)
app.include_router(journal.router, prefix=settings.API_V1_STR)
app.include_router(social.router, prefix=settings.API_V1_STR)
app.include_router(fraud.router, prefix=settings.API_V1_STR)
app.include_router(diversification.router, prefix=settings.API_V1_STR)
app.include_router(psychology.router, prefix=settings.API_V1_STR)
app.include_router(replay.router, prefix=settings.API_V1_STR)
app.include_router(agents.router, prefix=settings.API_V1_STR)
app.include_router(explainability.router, prefix=settings.API_V1_STR)
app.include_router(performance.router, prefix=settings.API_V1_STR)
app.include_router(stability_leaderboard.router, prefix=settings.API_V1_STR)

@app.get("/")
async def root():
    return {
        "message": "Welcome to AI Companion API",
        "docs": "/docs",
        "status": "online"
    }

from fastapi import WebSocket, WebSocketDisconnect
from app.api.ws.manager import manager

@app.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: int):
    await manager.connect(user_id, websocket)
    try:
        while True:
            # Keep connection alive
            data = await websocket.receive_text()
            # Handle incoming client messages if needed
    except WebSocketDisconnect:
        manager.disconnect(user_id, websocket)

@app.on_event("startup")
async def startup():
    # In production, use Alembic for migrations
    # For hackathon/dev, we can create tables on startup
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
