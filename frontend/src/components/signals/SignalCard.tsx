"use client";

import { useState, useEffect } from "react";
import { ArrowRight, ShieldCheck, Zap, TrendingUp, TrendingDown, Info, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { getTranslatedSignal } from "@/lib/api";

interface Signal {
  id: string;
  asset: string;
  side: "BUY" | "SELL";
  entry_price: number;
  stop_loss: number;
  original_risk: number;
  leader_name: string;
}

export default function SignalCard({ signal }: { signal: Signal }) {
  const [translated, setTranslated] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [executed, setExecuted] = useState(false);

  useEffect(() => {
    async function translate() {
      const data = await getTranslatedSignal(signal.id, "default_user");
      setTranslated(data);
      setLoading(false);
    }
    translate();
  }, [signal.id]);

  if (loading) {
    return <div className="h-48 w-full bg-slate-100 animate-pulse rounded-3xl" />;
  }

  return (
    <div className="bg-white rounded-[2.5rem] p-6 md:p-8 border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden group transition-all hover:shadow-2xl hover:shadow-indigo-100/50">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className={cn(
            "w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg",
            signal.side === "BUY" ? "bg-emerald-500 shadow-emerald-100" : "bg-rose-500 shadow-rose-100"
          )}>
            {signal.side === "BUY" ? <TrendingUp size={28} /> : <TrendingDown size={28} />}
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">{signal.asset}</h3>
            <p className="text-sm font-bold text-slate-400">Signal by <span className="text-indigo-600">{signal.leader_name}</span></p>
          </div>
        </div>
        <div className={cn(
          "px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase",
          signal.side === "BUY" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
        )}>
          {signal.side}
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Original Risk</p>
          <p className="text-lg font-bold text-slate-500 line-through decoration-rose-300/50">{signal.original_risk}%</p>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pt-2">Original SL</p>
          <p className="text-lg font-bold text-slate-500 line-through decoration-rose-300/50">{signal.stop_loss}</p>
        </div>

        <div className="p-4 rounded-2xl bg-indigo-600 border border-indigo-500 shadow-inner space-y-1 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2 text-indigo-400/30">
            <ShieldCheck size={40} />
          </div>
          <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest">Translated Risk</p>
          <p className="text-2xl font-black text-white">{translated.translated_size_percent}%</p>
          <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest pt-2">Translated SL</p>
          <p className="text-2xl font-black text-white">{translated.adjusted_stop_loss}</p>
        </div>
      </div>

      {/* Logic Insight */}
      <div className="flex items-start gap-3 p-4 rounded-2xl bg-indigo-50 border border-indigo-100 mb-8">
        <Info size={18} className="text-indigo-600 shrink-0 mt-0.5" />
        <p className="text-sm font-medium text-indigo-700 leading-relaxed italic">
          "{translated.explanation}"
        </p>
      </div>

      {/* Action */}
      <button 
        onClick={() => setExecuted(true)}
        disabled={executed}
        className={cn(
          "w-full py-4 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-2",
          executed 
            ? "bg-emerald-50 text-emerald-600 border-2 border-emerald-100" 
            : "bg-slate-900 text-white hover:bg-black hover:shadow-xl active:scale-95"
        )}
      >
        {executed ? (
          <>
            <CheckCircle2 size={22} />
            Position Executed
          </>
        ) : (
          <>
            Accept Smart Copy
            <Zap size={20} className="fill-amber-400 text-amber-400" />
          </>
        )}
      </button>
    </div>
  );
}
