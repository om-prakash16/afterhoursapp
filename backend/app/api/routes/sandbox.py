from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

router = APIRouter(prefix="/sandbox", tags=["sandbox"])

class SimulationRequest(BaseModel):
    asset: str
    side: str # BUY/SELL
    entry_price: float
    leverage: int
    size_usdt: float
    stop_loss: float
    take_profit: float

@router.post("/simulate")
async def simulate_trade(req: SimulationRequest):
    # Probabilistic math
    is_buy = req.side == "BUY"
    
    # 1. Breakeven (Entry + Fees)
    breakeven = req.entry_price * (1.001 if is_buy else 0.999) # 0.1% fee simulation
    
    # 2. Liquidation Price (Approx)
    liq_margin = 1.0 / req.leverage
    liq_price = req.entry_price * (1 - liq_margin) if is_buy else req.entry_price * (1 + liq_margin)
    
    # 3. Best Case (Hit TP)
    pnl_tp = (req.take_profit - req.entry_price) / req.entry_price * req.leverage
    if not is_buy: pnl_tp = -pnl_tp
    best_case_roi = pnl_tp * 100
    best_case_usdt = req.size_usdt * pnl_tp
    
    # 4. Worst Case (Hit SL)
    pnl_sl = (req.stop_loss - req.entry_price) / req.entry_price * req.leverage
    if not is_buy: pnl_sl = -pnl_sl
    worst_case_roi = pnl_sl * 100
    worst_case_usdt = req.size_usdt * pnl_sl
    
    return {
        "scenarios": [
            {"label": "Best Case (TP)", "price": req.take_profit, "roi": round(best_case_roi, 2), "pnl": round(best_case_usdt, 2), "color": "#10b981"},
            {"label": "Breakeven", "price": round(breakeven, 4), "roi": 0, "pnl": 0, "color": "#6366f1"},
            {"label": "Worst Case (SL)", "price": req.stop_loss, "roi": round(worst_case_roi, 2), "pnl": round(worst_case_usdt, 2), "color": "#f43f5e"},
            {"label": "Liquidation", "price": round(liq_price, 4), "roi": -100, "pnl": -req.size_usdt, "color": "#000000"}
        ],
        "risk_reward_ratio": round(abs(best_case_roi / worst_case_roi), 2) if worst_case_roi != 0 else 0
    }
