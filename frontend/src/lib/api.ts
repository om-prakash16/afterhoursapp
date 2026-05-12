const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export async function chatWithAI(message: string, userId: string = "default_user") {
  const response = await fetch(`${API_BASE_URL}/chat/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      user_id: userId,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to get response from AI");
  }

  return response.json();
}

export async function getAnalytics(userId: string = "default_user") {
  const response = await fetch(`${API_BASE_URL}/analytics/${userId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch analytics");
  }
  return response.json();
}

export async function login(email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: email, password }), // Backend usually expects username
  });
  if (!response.ok) throw new Error("Login failed");
  return response.json();
}

export async function register(email: string, name: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, full_name: name, password }),
  });
  if (!response.ok) throw new Error("Registration failed");
  return response.json();
}

export async function getDNA(userId: string) {
  const response = await fetch(`${API_BASE_URL}/dna/${userId}`);
  if (!response.ok) throw new Error("Failed to fetch DNA");
  return response.json();
}

export async function updateDNA(userId: string, risk: number) {
  const response = await fetch(`${API_BASE_URL}/dna/update?user_id=${userId}&risk=${risk}`, {
    method: "POST"
  });
  if (!response.ok) throw new Error("Failed to update DNA");
  return response.json();
}

export async function getSignals() {
  // Mocking since we might not have a route for list yet
  return [
    {
      id: "s1",
      asset: "BTC/USDT",
      side: "BUY",
      entry_price: 64200,
      stop_loss: 62000,
      original_risk: 1.0,
      leader_name: "AlphaWhale"
    },
    {
      id: "s2",
      asset: "ETH/USDT",
      side: "SELL",
      entry_price: 3450,
      stop_loss: 3600,
      original_risk: 1.5,
      leader_name: "SatoshiScalp"
    }
  ];
}

export async function getTranslatedSignal(signalId: string, userId: string) {
  const response = await fetch(`${API_BASE_URL}/signals/translate/${signalId}?user_id=${userId}`);
  if (!response.ok) {
     // Mock translation for the demo if backend route isn't fully ready
     return {
        translated_size_percent: 0.4,
        adjusted_stop_loss: 61500,
        explanation: "Scaled down to match your Conservative DNA profile."
     }
  }
  return response.json();
}
export async function submitOnboarding(data: any) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/onboarding/`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Onboarding failed");
  return response.json();
}
export async function getMyDNA() {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/dna/me`, {
    headers: { 
      "Authorization": `Bearer ${token}`
    },
  });
  if (!response.ok) throw new Error("Failed to fetch DNA");
  return response.json();
}
export async function getPersonalizedSignals() {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/signals/personalized`, {
    headers: { 
      "Authorization": `Bearer ${token}`
    },
  });
  if (!response.ok) throw new Error("Failed to fetch signals");
  return response.json();
}
export async function submitEmotionalCheck(answers: any, tradeIntent: any) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/emotions/check`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ answers, trade_intent: tradeIntent }),
  });
  if (!response.ok) throw new Error("Failed to submit emotional check");
  return response.json();
}
export async function getLeaderboard() {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/leaderboard/`, {
    headers: { 
      "Authorization": `Bearer ${token}`
    },
  });
  if (!response.ok) throw new Error("Failed to fetch leaderboard");
  return response.json();
}
export async function getPortfolioSummary() {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/portfolio/summary`, {
    headers: { "Authorization": `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to fetch portfolio summary");
  return response.json();
}

export async function getTradeHistory(status?: string, assetType?: string) {
  const token = localStorage.getItem("token");
  let url = `${API_BASE_URL}/portfolio/history`;
  const params = new URLSearchParams();
  if (status) params.append("status", status);
  if (assetType) params.append("asset_type", assetType);
  if (params.toString()) url += `?${params.toString()}`;

  const response = await fetch(url, {
    headers: { "Authorization": `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to fetch trade history");
  return response.json();
}

export async function getPerformanceData() {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/portfolio/performance`, {
    headers: { "Authorization": `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to fetch performance data");
  return response.json();
}
export async function getRecoveryStatus() {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/performance/recovery-status`, {
    headers: { "Authorization": `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to fetch recovery status");
  return response.json();
}

export async function getTradeScores() {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/performance/trade-scores`, {
    headers: { "Authorization": `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to fetch trade scores");
  return response.json();
}

export async function getExplainabilityAudit() {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/explainability/audit`, {
    headers: { "Authorization": `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to fetch explainability audit");
  return response.json();
}

export async function getAgentConsensus(tradeParams: any) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/agents/consensus`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}` 
    },
    body: JSON.stringify(tradeParams)
  });
  if (!response.ok) throw new Error("Failed to fetch agent consensus");
  return response.json();
}

export async function getNotifications() {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/notifications/`, {
    headers: { "Authorization": `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to fetch notifications");
  return response.json();
}

export async function getDiversificationAudit() {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/diversification/audit`, {
    headers: { "Authorization": `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to fetch diversification audit");
  return response.json();
}

export async function getBehavioralTimeline() {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/psychology/timeline`, {
    headers: { "Authorization": `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to fetch behavioral timeline");
  return response.json();
}

export async function getTradeReplaySnapshots(tradeId: string) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/replay/${tradeId}`, {
    headers: { "Authorization": `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to fetch trade replay");
  return response.json();
}

export async function getUserRiskScore() {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/risk/score`, {
    headers: { "Authorization": `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to fetch risk score");
  return response.json();
}

export async function getCooldownStatus() {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/performance/recovery-status`, {
    headers: { "Authorization": `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to fetch cooldown status");
  return response.json();
}

export async function getEconomicEvents() {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/market/economic-events`, {
    headers: { "Authorization": `Bearer ${token}` },
  });
  if (!response.ok) {
     // Mock for demo if route missing
     return [
       { id: 1, name: "FOMC Meeting", date: new Date().toISOString(), category: "Macro", impact: "CRITICAL", sensitivity: "High", prediction: "Hawkish" },
       { id: 2, name: "CPI Data", date: new Date().toISOString(), category: "Inflation", impact: "HIGH", sensitivity: "Moderate", prediction: "3.2%" }
     ];
  }
  return response.json();
}

export async function getSocialFeed() {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/social/feed`, {
    headers: { "Authorization": `Bearer ${token}` },
  });
  if (!response.ok) {
     return [
       { id: 1, user: { name: "CryptoKing", rank: "ELITE" }, timestamp: new Date().toISOString(), content: "Macro signals indicate a strong reversal at 62k. DNA alignment looks optimal for a swing long.", reactions: 24, comments: 12, is_verified: true, asset: "BTC/USDT" },
       { id: 2, user: { name: "ZenTrader", rank: "PRO" }, timestamp: new Date().toISOString(), content: "Patience is paying off. Avoided the fakeout at 3.5k. Aura is currently in defensive mode.", reactions: 15, comments: 5, is_verified: true, asset: "ETH/USDT" }
     ];
  }
  return response.json();
}

export async function createSocialPost(data: any) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/social/post`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}` 
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create social post");
  return response.json();
}


