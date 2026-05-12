"use client";

import { useEffect, useState } from "react";
import { 
  History, 
  Search, 
  Filter, 
  ArrowUpRight, 
  ArrowDownRight, 
  CheckCircle2, 
  XCircle,
  Brain,
  Zap,
  Info
} from "lucide-react";
import { getTradeHistory } from "@/lib/api";

export default function TradeHistoryPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getTradeHistory();
        setHistory(data);
      } catch (err) {
        console.error("Failed to fetch history", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 pb-20 pt-28 px-6">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-indigo-400">
              <History size={32} />
              <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Audit History</h1>
            </div>
            <p className="text-slate-500 max-w-xl font-medium">
              Review every trade with institutional precision. Track how well you followed Aura's advice and your emotional state at the time of entry.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input 
                type="text" 
                placeholder="Search Asset..." 
                className="bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-6 text-sm focus:outline-none focus:border-indigo-500 transition-all w-full md:w-64"
              />
            </div>
            <button className="p-3 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all">
              <Filter size={20} />
            </button>
          </div>
        </div>

        {/* Legend / Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <QuickStat label="Discipline Rate" value="94%" icon={CheckCircle2} color="text-emerald-400" />
          <QuickStat label="Avg Emotional Score" value="82/100" icon={Brain} color="text-indigo-400" />
          <QuickStat label="Total Volume" value="$42,500" icon={Zap} color="text-amber-400" />
        </div>

        {/* Detailed History Table */}
        <div className="glass-morphism rounded-[3rem] border border-white/10 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/5">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Asset & Date</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Execution</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500 text-center">AI Audit</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500 text-center">Emotion</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Net Profit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {history.map((trade) => (
                <tr key={trade.id} className="hover:bg-white/5 transition-all group">
                  <td className="px-8 py-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-white/10 flex items-center justify-center font-bold text-white uppercase text-lg">
                        {trade.asset.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-lg text-white">{trade.asset}</div>
                        <div className="text-[10px] text-slate-500 font-bold uppercase">{new Date(trade.opened_at).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-8">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest ${trade.side === "BUY" ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"}`}>
                          {trade.side}
                        </span>
                        <span className="text-sm font-bold text-white">${trade.size_usdt.toLocaleString()}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{trade.leverage}x DNA LEVERAGE</div>
                    </div>
                  </td>
                  <td className="px-8 py-8 text-center">
                    <div className="flex flex-col items-center gap-1">
                      {trade.followed_advice ? (
                        <div className="flex items-center gap-1.5 text-emerald-400 font-black text-[10px] uppercase tracking-widest">
                          <CheckCircle2 size={14} /> Followed AI
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-rose-400 font-black text-[10px] uppercase tracking-widest">
                          <XCircle size={14} /> Ignored AI
                        </div>
                      )}
                      <div className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                        trade.risk_level === "LOW" ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-500" : "bg-rose-500/5 border-rose-500/20 text-rose-500"
                      }`}>
                        {trade.risk_level} RISK
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-8 text-center">
                    <div className="inline-block px-4 py-2 rounded-2xl bg-white/5 border border-white/10">
                      <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Psych Score</div>
                      <div className={`text-sm font-black ${trade.emotional_score > 70 ? "text-emerald-400" : "text-rose-400"}`}>
                        {trade.emotional_score}/100
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-8 text-right">
                    <div className={`text-xl font-black flex items-center justify-end gap-1 ${trade.pnl_usdt >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                      {trade.pnl_usdt >= 0 ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
                      ${Math.abs(trade.pnl_usdt).toLocaleString()}
                    </div>
                    <div className={`text-xs font-bold uppercase ${trade.pnl_percent >= 0 ? "text-emerald-500/60" : "text-rose-500/60"}`}>
                      {trade.pnl_percent >= 0 ? "+" : ""}{trade.pnl_percent}% ROI
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

function QuickStat({ label, value, icon: Icon, color }: any) {
  return (
    <div className="glass-morphism rounded-[2rem] border border-white/10 p-6 flex items-center gap-5 hover:border-white/20 transition-all group">
      <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center ${color} group-hover:scale-110 transition-transform`}>
        <Icon size={24} />
      </div>
      <div>
        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</div>
        <div className="text-xl font-black text-white">{value}</div>
      </div>
    </div>
  );
}
