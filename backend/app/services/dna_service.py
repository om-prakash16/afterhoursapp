from typing import Dict

def determine_archetype(risk: float, aggression: float, patience: float, discipline: float, emotional_control: float) -> str:
    """
    Categorize the trader into an archetype based on their DNA metrics.
    """
    # Simple heuristic logic
    if patience >= 0.7 and risk <= 0.4:
        return "Patient Strategist"
    
    if aggression >= 0.7 and patience <= 0.4:
        return "Aggressive Scalper"
    
    if risk >= 0.7 and aggression >= 0.6:
        return "Chaos Voyager"
    
    if discipline >= 0.8 and patience >= 0.6:
        return "Precision Architect"
    
    if risk <= 0.3 and discipline >= 0.7:
        return "Safe Haven Guard"
    
    if aggression >= 0.5 and patience >= 0.5 and discipline >= 0.5:
        return "Balanced Builder"
    
    return "Universal Explorer"

def get_archetype_description(archetype: str) -> str:
    descriptions = {
        "Patient Strategist": "You wait for the perfect setup. Low risk, high reward, and extreme discipline define your edge.",
        "Aggressive Scalper": "You thrive in high-frequency environments. Fast moves and quick exits are your bread and butter.",
        "Chaos Voyager": "High risk is your playground. You capitalize on extreme volatility where others fear to tread.",
        "Precision Architect": "Every trade is a calculated masterpiece. You focus on technical perfection and execution.",
        "Safe Haven Guard": "Capital preservation is your #1 rule. You build wealth steadily with minimal exposure.",
        "Balanced Builder": "A versatile approach that adapts to market conditions. You balance risk and reward effectively.",
        "Universal Explorer": "You are still defining your style, testing various strategies across the market spectrum."
    }
    return descriptions.get(archetype, "A unique blend of trading traits.")
