import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import AsyncSessionLocal as SessionLocal, engine, Base
from app.models.user import User
from app.models.trade_dna import TradeDNA
from app.models.trading import Portfolio, Trade, EmotionalCheck, Leaderboard, Notification
from app.models.signals import Signal
from app.models.provider import SignalProvider
from app.core.security import get_password_hash
import uuid

async def seed_data():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        
    async with SessionLocal() as db:
        # 1. Create Admin & Sample Users
        admin_pass = get_password_hash("admin123")
        user_pass = get_password_hash("user123")
        
        admin = User(
            email="admin@afterhours.ai",
            full_name="Nexus Commander",
            hashed_password=admin_pass,
            is_superuser=True
        )
        
        trader_alpha = User(
            email="alpha@trader.com",
            full_name="Alpha Centauri",
            hashed_password=user_pass
        )
        
        trader_beta = User(
            email="beta@trader.com",
            full_name="Beta Shield",
            hashed_password=user_pass
        )

        db.add_all([admin, trader_alpha, trader_beta])
        await db.commit()
        await db.refresh(trader_alpha)
        await db.refresh(trader_beta)

        # 2. Create DNA Profiles
        dna_alpha = TradeDNA(
            user_id=trader_alpha.id,
            risk_tolerance=0.8,
            aggression=0.9,
            patience=0.3,
            technical_bias=0.4,
            archetype="Aggressive Scalper"
        )
        
        dna_beta = TradeDNA(
            user_id=trader_beta.id,
            risk_tolerance=0.3,
            aggression=0.2,
            patience=0.9,
            technical_bias=0.8,
            archetype="Safe Haven Guard"
        )

        db.add_all([dna_alpha, dna_beta])

        # 3. Create Portfolios
        port_alpha = Portfolio(
            user_id=trader_alpha.id,
            total_balance=25000.0,
            available_margin=22500.0,
            total_profit=1500.0,
            win_rate=68.5
        )
        
        port_beta = Portfolio(
            user_id=trader_beta.id,
            total_balance=50000.0,
            available_margin=45000.0,
            total_profit=4200.0,
            win_rate=82.1
        )

        db.add_all([port_alpha, port_beta])

        # 4. Create Signal Providers
        provider = SignalProvider(
            name="Institutional Whale",
            strategy="Macro Trend",
            win_rate=76.2,
            avg_leverage=5,
            consistency_score=94,
            trust_score=98,
            is_verified=True
        )
        db.add(provider)
        await db.commit()
        await db.refresh(provider)

        # 5. Create Signals
        sig1 = Signal(
            asset="BTC/USDT",
            side="BUY",
            entry_price=64500.0,
            stop_loss=62000.0,
            take_profit=70000.0,
            risk_level=3,
            leader_id=admin.id,
            is_active=True
        )
        
        sig2 = Signal(
            asset="ETH/USDT",
            side="SELL",
            entry_price=3450.0,
            stop_loss=3600.0,
            take_profit=3000.0,
            risk_level=2,
            leader_id=admin.id,
            is_active=True
        )

        db.add_all([sig1, sig2])

        # 6. Create Notifications
        notif = Notification(
            user_id=trader_alpha.id,
            type="SIGNAL",
            title="Aura Translation Ready",
            message="Institutional signal for BTC detected. Your personalized translation is ready for execution.",
            is_read=0
        )
        db.add(notif)

        # 7. Create Leaderboard Entries
        entry_alpha = Leaderboard(
            user_id=trader_alpha.id,
            consistency_score=72,
            discipline_score=65,
            safety_score=58,
            emotional_score=60,
            profit_percent=12.4,
            current_rank=142
        )
        
        entry_beta = Leaderboard(
            user_id=trader_beta.id,
            consistency_score=98,
            discipline_score=96,
            safety_score=99,
            emotional_score=95,
            profit_percent=8.2,
            current_rank=4
        )

        db.add_all([entry_alpha, entry_beta])

        # 8. Create Emotional Checks (FOMO Danger)
        emotion = EmotionalCheck(
            user_id=trader_alpha.id,
            mood="anxious",
            detected_risk="FOMO_DANGER",
            risk_level="HIGH",
            recommendation="Aura suggests a 30-minute cooldown."
        )
        db.add(emotion)

        await db.commit()
        print("Demo ecosystem seeded successfully.")

if __name__ == "__main__":
    asyncio.run(seed_data())
