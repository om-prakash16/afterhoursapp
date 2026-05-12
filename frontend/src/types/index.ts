export interface User {
  id: string;
  email: string;
  full_name?: string;
  is_active: boolean;
}

export interface TradeDNA {
  id: string;
  user_id: string;
  risk_tolerance: number;
  aggression: number;
  patience: number;
  technical_bias: number;
  archetype: string;
  created_at: string;
}

export interface Signal {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  price: number;
  stop_loss: number;
  take_profit: number;
  timestamp: string;
  provider: string;
}
