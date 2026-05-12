"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  BookOpen, 
  Search, 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  Brain, 
  Target, 
  ShieldCheck,
  ChevronRight,
  Filter,
  Activity,
  Play
} from "lucide-react";
import { getTradeJournal } from "@/lib/api";
import { SkeletonRow, EmptyState } from "@/components/ui/States";

export default function JournalPage() {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchJournal = async () => {
      try {
        const data = await getTradeJournal();
        setEntries(data);
      } catch (err) {
        console.error("Journal fetch error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJournal();
  }, []);

  const filteredEntries = entries.filter(e => 
    e.trade.asset.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 pb-20 pt-28 px-6">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-indigo-400">
              <BookOpen size={32} />
              <h1 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">Strategic Archive</h1>
            </div>
            <p className="text-slate-500 max-w-xl font-medium">
              Every execution is a lesson. Aura performs an autonomous post-mortem on your closed trades to identify behavioral patterns.
            </p>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            <input 
              type="text" 
              placeholder="Search by asset (e.g. BTC, ETH)..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-16 pr-8 text-sm focus:outline-none focus:border-indigo-500 transition-all shadow-2xl"
            />
          </div>
          <button className="px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all">
            <Filter size={20} />
          </button>
        </div>

        {/* Timeline */}
        <div className="space-y-6">
          {loading ? (
            <>
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
            </>
          ) : filteredEntries.length > 0 ? (
            filteredEntries.map((entry, idx) => (
              <JournalEntry key={idx} entry={entry} />
            ))
          ) : (
            <EmptyState 
              icon={BookOpen} 
              title="Journal is Empty" 
              message="Complete your first trade to begin your strategic archive. Aura is ready to audit your performance." 
            />
          )}
        </div>

      </div>
    </div>
  );
}

function JournalEntry({ entry }: { entry: any }) {
  const { trade, ai_analysis } = entry;
  const isWin = trade.pnl_usdt > 0;

  return (
    <div className="glass-morphism rounded-[2.5rem] border border-white/10 overflow-hidden group hover:border-white/20 transition-all bg-white/[0.01]">
      <div className="p-8 space-y-8">
        {/* Trade Header */}
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${isWin ? 'bg-emerald-500/10 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.1)]' : 'bg-rose-500/10 text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.1)]'}`}>
              {isWin ? <TrendingUp size={28} /> : <TrendingDown size={28} />}
            </div>
            <div>
              <div className="text-2xl font-black text-white">{trade.asset}</div>
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                {new Date(trade.opened_at).toLocaleDateString()} • {trade.side} • {trade.leverage}x
              </div>
            </div>
          </div>
          <div className="text-right">
             <div className={`text-2xl font-black ${isWin ? 'text-emerald-400' : 'text-rose-400'}`}>
               {isWin ? '+' : ''}${Math.abs(trade.pnl_usdt).toLocaleString()}
             </div>
             <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Net Realized PnL</div>
          </div>
        </div>

        {/* AI Behavioral Coaching - Multi-Category */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <CoachCard 
             title="Emotional Stability" 
             icon={Brain} 
             data={ai_analysis.categories.stability} 
             color="text-indigo-400"
           />
           <CoachCard 
             title="Discipline" 
             icon={ShieldCheck} 
             data={ai_analysis.categories.discipline} 
             color="text-emerald-400"
           />
           <CoachCard 
             title="Risk Management" 
             icon={Target} 
             data={ai_analysis.categories.risk} 
             color="text-amber-400"
           />
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
           <Metric label="Emotional Stability" value={trade.emotional_score > 0.7 ? "ELITE" : "VOLATILE"} color={trade.emotional_score > 0.7 ? "text-emerald-400" : "text-amber-400"} />
           <Metric label="Risk Protocol" value={trade.followed_advice ? "FOLLOWED" : "DEVIATED"} color={trade.followed_advice ? "text-indigo-400" : "text-rose-400"} />
           <Metric label="Position Size" value={`$${trade.size_usdt.toLocaleString()}`} color="text-white" />
           <Metric label="Entry Price" value={`$${trade.entry_price.toLocaleString()}`} color="text-white" />
        </div>
        <div className="pt-8 border-t border-white/5 flex justify-end">
            <Link 
              href={`/replay/${trade.id}`}
              className="px-8 py-4 rounded-2xl bg-indigo-600 text-white font-black text-xs uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 active:scale-95 flex items-center gap-3"
            >
               <Play size={16} fill="currentColor" /> Forensic Replay
            </Link>
         </div>
      </div>
    </div>
  );
}

function Metric({ label, value, color }: any) {
  return (
    <div className="space-y-1">
      <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{label}</div>
      <div className={`text-sm font-black tracking-tight ${color}`}>{value}</div>
    </div>
  );
}
function CoachCard({ title, icon: Icon, data, color }: any) {
  return (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-4 group/coach hover:bg-white/10 transition-all">
      <div className="flex justify-between items-center">
        <div className={`flex items-center gap-2 ${color}`}>
          <Icon size={16} />
          <span className="text-[10px] font-black uppercase tracking-widest">{title}</span>
        </div>
        <div className="text-sm font-black text-white">{data.score}%</div>
      </div>
      <div className="space-y-3">
        <p className="text-xs text-slate-300 font-medium leading-relaxed">
          {data.feedback}
        </p>
        <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-[10px] font-medium text-slate-400">
           <span className="text-indigo-400 font-black uppercase mr-2">Aura Tip:</span>
           {data.suggestion}
        </div>
      </div>
    </div>
  );
}
