"use client";

import { useEffect, useState } from "react";
import { 
  ShieldCheck, 
  TrendingUp, 
  Users, 
  Zap, 
  Star, 
  BarChart3, 
  Target, 
  CheckCircle2,
  ChevronRight,
  ExternalLink
} from "lucide-react";

export default function ProvidersPage() {
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock for demo
    setTimeout(() => {
      setProviders([
        {
          id: 1,
          name: "Alpha Prime Institutional",
          description: "High-frequency quantitative analysis focusing on BTC and ETH major movements.",
          avatar: "A",
          win_rate: 84.2,
          avg_leverage: 5,
          consistency_score: 96,
          trust_score: 98,
          risk_level: "LOW",
          subscribers: 1240,
          pnl: "+245.2%"
        },
        {
          id: 2,
          name: "Zenith Alpha",
          description: "Safe haven strategy specializing in capital preservation during high volatility.",
          avatar: "Z",
          win_rate: 72.1,
          avg_leverage: 2,
          consistency_score: 92,
          trust_score: 95,
          risk_level: "LOW",
          subscribers: 850,
          pnl: "+112.5%"
        },
        {
          id: 3,
          name: "Volatility Hunter",
          description: "Aggressive scalping desk targeting rapid liquidation clusters.",
          avatar: "V",
          win_rate: 68.5,
          avg_leverage: 15,
          consistency_score: 85,
          trust_score: 88,
          risk_level: "HIGH",
          subscribers: 3100,
          pnl: "+420.8%"
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 pb-20 pt-28 px-6">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-indigo-400">
              <Users size={32} />
              <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Signal Intelligence</h1>
            </div>
            <p className="text-slate-500 max-w-xl font-medium">
              Aura connects you to the world's most disciplined signal providers. Every provider is audited by our AI to ensure their risk profile matches your DNA.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
              <CheckCircle2 size={18} className="text-emerald-500" />
              <span className="text-[10px] font-black text-white uppercase tracking-widest">Aura Audited</span>
            </div>
          </div>
        </div>

        {/* Providers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {providers.map((p) => (
            <ProviderCard key={p.id} provider={p} />
          ))}
        </div>

      </div>
    </div>
  );
}

function ProviderCard({ provider: p }: any) {
  return (
    <div className="glass-morphism rounded-[2.5rem] border border-white/10 p-8 flex flex-col h-full group hover:border-indigo-500/30 transition-all">
      <div className="flex justify-between items-start mb-8">
        <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-white/10 flex items-center justify-center text-2xl font-black text-white group-hover:scale-110 transition-transform">
          {p.avatar}
        </div>
        <div className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
          p.risk_level === "LOW" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
        }`}>
          {p.risk_level} Risk Source
        </div>
      </div>

      <div className="space-y-2 mb-6">
        <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          {p.name}
          {p.trust_score > 95 && <ShieldCheck size={18} className="text-indigo-400" />}
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
          {p.description}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
          <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Win Rate</div>
          <div className="text-lg font-black text-white">{p.win_rate}%</div>
        </div>
        <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
          <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Total PnL</div>
          <div className="text-lg font-black text-emerald-400">{p.pnl}</div>
        </div>
      </div>

      <div className="space-y-4 flex-1">
        <div className="flex justify-between items-center text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <BarChart3 size={14} />
            Consistency
          </div>
          <span className="font-black text-white">{p.consistency_score}%</span>
        </div>
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${p.consistency_score}%` }} />
        </div>
      </div>

      <div className="pt-8 flex items-center gap-3">
        <button className="flex-1 py-4 rounded-xl bg-indigo-600 text-white font-black text-[10px] uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20 active:scale-95">
          Follow Provider
        </button>
        <button className="p-4 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all group/btn">
          <ExternalLink size={18} className="group-hover/btn:scale-110 transition-transform" />
        </button>
      </div>
    </div>
  );
}
