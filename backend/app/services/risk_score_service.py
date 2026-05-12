from typing import Annotated, Any, List, Dict, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc
from app.models.trading import Trade, EmotionalCheck, Portfolio

class RiskScoreEngine:
    """
    Calculates a holistic 0-100 risk score (lower is safer).
    """
    
    async def calculate_user_risk_score(self, user_id: int, session: AsyncSession) -> Dict[str, Any]:
        # 1. Fetch Recent Trades (last 20)
        trades_stmt = select(Trade).where(Trade.user_id == user_id).order_by(desc(Trade.opened_at)).limit(20)
        trades_result = await session.execute(trades_stmt)
        trades = list(trades_result.scalars().all())
        
        # 2. Fetch Recent Emotional Checks
        emotions_stmt = select(EmotionalCheck).where(EmotionalCheck.user_id == user_id).order_by(desc(EmotionalCheck.created_at)).limit(10)
        emotions_result = await session.execute(emotions_stmt)
        emotions = list(emotions_result.scalars().all())
        
        if not trades:
            return {"score": 50, "status": "NEUTRAL", "reason": "Insufficient data to calculate score."}

        # FACTOR 1: Leverage Usage (Weight: 25%)
        # > 10x is high risk
        avg_leverage = sum(t.leverage for t in trades) / len(trades)
        leverage_risk = min(100, (avg_leverage / 20) * 100)
        
        # FACTOR 2: Trade Frequency (Weight: 20%)
        # > 10 trades per day is high risk
        freq_risk = min(100, (len(trades) / 10) * 100)
        
        # FACTOR 3: Emotional Stability (Weight: 25%)
        # Invert the safety score: 100 safety = 0 risk
        if emotions:
            avg_emo_safety = sum(e.overall_safety_score for e in emotions) / len(emotions)
            emotional_risk = 100 - avg_emo_safety
        else:
            emotional_risk = 50 # Default if no checks
            
        # FACTOR 4: Stop Loss Discipline (Weight: 20%)
        # Followed AI advice = low risk
        followed_advice_count = sum(1 for t in trades if t.followed_advice == 1)
        discipline_risk = 100 - ((followed_advice_count / len(trades)) * 100)
        
        # FACTOR 5: Performance Drawdown (Weight: 10%)
        pnl_values = [t.pnl_percent for t in trades if t.pnl_percent is not None]
        avg_pnl = sum(pnl_values) / len(pnl_values) if pnl_values else 0
        pnl_risk = 0 if avg_pnl > 0 else min(100, abs(avg_pnl) * 5)

        # Weighted Final Score
        final_score = (
            (leverage_risk * 0.25) +
            (freq_risk * 0.20) +
            (emotional_risk * 0.25) +
            (discipline_risk * 0.20) +
            (pnl_risk * 0.10)
        )
        
        status = "LOW"
        if final_score > 70: status = "CRITICAL"
        elif final_score > 40: status = "MODERATE"
        
        return {
            "score": round(final_score, 1),
            "status": status,
            "breakdown": {
                "leverage_risk": round(leverage_risk, 1),
                "frequency_risk": round(freq_risk, 1),
                "emotional_risk": round(emotional_risk, 1),
                "discipline_risk": round(discipline_risk, 1),
                "performance_risk": round(pnl_risk, 1)
            },
            "recommendation": self._get_recommendation(status, final_score)
        }

    def _get_recommendation(self, status: str, score: float) -> str:
        if status == "CRITICAL":
            return "Extreme risk detected. Aura recommends a 24-hour cooling-off period and reducing leverage to 1x."
        if status == "MODERATE":
            return "Moderate behavior drift. Ensure you are performing emotional checks before every execution."
        return "Excellent risk management. Your behavior is perfectly aligned with professional institutional standards."

risk_score_engine = RiskScoreEngine()
