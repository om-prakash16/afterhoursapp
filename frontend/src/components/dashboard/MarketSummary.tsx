"use client";

import { 
  Activity, 
  ShieldAlert, 
  TrendingUp, 
  TrendingDown, 
  Zap, 
  BarChart3, 
  Globe,
  Waves
} from "lucide-react";

export default function MarketSummary() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      
      {/* Sentiment Card */}
      <SummaryCard 
        label="Global Sentiment" 
        value="Greed (68)" 
        sub="Dominant: Bullish" 
        icon={Globe} 
        color="text-emerald-400" 
      />

      {/* Volatility Card */}
      <SummaryCard 
        label="Market Volatility" 
        value="Moderate" 
        sub="VIX Index: 14.2" 
        icon={Waves} 
        color="text-amber-400" 
      />

      {/* Risk Zone Card */}
      <SummaryCard 
        label="Risk Zone" 
        value="Safe Execution" 
        sub="No Liquidation Spirals" 
        icon={ShieldAlert} 
        color="text-indigo-400" 
      />

      {/* Platform Activity Card */}
      <SummaryCard 
        label="Aura Activity" 
        value="High Sync" 
        sub="842 Signals Analyzed" 
        icon={Zap} 
        color="text-amber-400" 
      />

    </div>
  );
}

function SummaryCard({ label, value, sub, icon: Icon, color }: any) {
  return (
    <div className="glass-morphism rounded-3xl border border-white/10 p-6 flex items-center gap-6 group hover:border-white/20 transition-all">
      <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center ${color} group-hover:scale-110 transition-transform`}>
        <Icon size={24} />
      </div>
      <div>
        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">{label}</div>
        <div className="text-lg font-black text-white tracking-tight">{value}</div>
        <div className="text-[10px] font-bold text-slate-600 uppercase mt-0.5">{sub}</div>
      </div>
    </div>
  );
}
