from typing import Annotated, Any, List, Dict, Optional

def analyze_emotional_state(answers: Dict[str, Any]) -> Dict[str, Any]:
    """
    Analyze the Q&A to detect psychological trading risks.
    """
    # Questions might be: 
    # 1. How did your last trade end? (WIN, LOSS, N/A)
    # 2. How are you feeling about this move? (EXCITED, FEARFUL, NEUTRAL, URGENT)
    # 3. How much of your daily profit/loss limit have you hit? (0%, 50%, 100%)

    last_trade = answers.get("last_trade", "").upper()
    mood = answers.get("mood", "").upper()
    urgency = answers.get("urgency", "").upper()

    risk_detected = "STABLE"
    risk_level = "LOW"
    recommendation = "You are in a clear state of mind. Proceed with your planned strategy."

    # Logic for Revenge Trading
    if last_trade == "LOSS" and urgency == "HIGH":
        risk_detected = "REVENGE_TRADING"
        risk_level = "HIGH"
        recommendation = "WARNING: You are likely chasing a loss. Close the terminal and step away for 30 minutes to reset your emotional baseline."

    # Logic for Overconfidence
    elif last_trade == "WIN" and mood == "EXCITED":
        risk_detected = "OVERCONFIDENCE"
        risk_level = "MEDIUM"
        recommendation = "You're on a winning streak! Be careful not to deviate from your risk parameters. Emotional highs can lead to sloppy execution."

    # Logic for Fear/Panic
    elif mood == "FEARFUL" or urgency == "PANIC":
        risk_detected = "PANIC_RESPONSE"
        risk_level = "HIGH"
        recommendation = "Trading from fear leads to premature exits. If you don't trust the setup, don't take the trade. Review your SL/TP plan."

    # Logic for Greed
    elif mood == "GREED" or urgency == "FOMO":
        risk_detected = "FOMO_GREED"
        risk_level = "MEDIUM"
        recommendation = "FOMO detected. Ensure this trade meets all your technical criteria, not just the 'fear of missing out' on a pump."

    return {
        "detected_risk": risk_detected,
        "risk_level": risk_level,
        "recommendation": recommendation,
        "mood": mood
    }
