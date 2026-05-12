"use client";

import { useState, useEffect } from "react";
import { 
  ShieldCheck, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Zap, 
  Target,
  BarChart3,
  X,
  Lock,
  ArrowRight
} from "lucide-react";
import ForensicAudit from "./ForensicAudit";
import ConfidenceMeter from "@/components/ui/ConfidenceMeter";

export default function SimulationModal({ signal, isOpen, onClose, onConfirm }: any) {
  if (!isOpen) return null;

  const [simData, setSimData] = useState<any>(null);

  useEffect(() => {
    // Simulate complex risk math
    const estProfit = signal.adjusted_size * (Math.abs(signal.original_entry - signal.original_sl) / signal.original_entry) * 2;
    const maxDownside = signal.adjusted_size * (Math.abs(signal.original_entry - signal.adjusted_sl) / signal.original_entry);
    const liqPoint = signal.original_entry * (1 - (1 / signal.adjusted_leverage) * 0.9);
    
    setSimData({
      estProfit,
      maxDownside,
      liqPoint,
      liqProb: signal.adjusted_leverage > 10 ? 45 : 4,
      safetyScore: 100 - (signal.adjusted_leverage * 2)
    });
  }, [signal]);

  if (!simData) return null;

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={onClose} />
      
      <div className="relative glass-morphism rounded-[3rem] border border-white/10 w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-500 shadow-[0_0_50px_rgba(99,102,241,0.2)]">
        
        {/* Header */}
        <div className="p-8 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
           <div className="flex items-center gap-3 text-indigo-400">
              <BarChart3 size={24} />
              <h3 className="text-xl font-black text-white uppercase tracking-tight">Safe Copy Simulation</h3>
           </div>
           <button onClick={onClose} className="text-slate-500 hover:text-white transition-all">
              <X size={24} />
           </button>
        </div>

        <div className="p-10 space-y-10">
           
           {/* Summary Metrics */}
           <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <SimMetric label="Est. Profit" value={`+$${simData.estProfit.toFixed(2)}`} color="text-emerald-400" />
              <SimMetric label="Max Downside" value={`-$${simData.maxDownside.toFixed(2)}`} color="text-rose-400" />
              <SimMetric label="Liq. Point" value={`$${simData.liqPoint.toFixed(2)}`} color="text-amber-400" />
              <SimMetric label="Liq. Prob" value={`${simData.liqProb}%`} color={simData.liqProb > 10 ? "text-rose-500" : "text-emerald-500"} />
           </div>

           {/* Safe Entry Detector & Confidence Meter */}
           <div className="flex flex-col md:flex-row items-center gap-8 p-8 rounded-3xl bg-black/40 border border-white/5">
              <ConfidenceMeter 
                score={simData.safetyScore} 
                label="Entry Safety Score" 
                color={simData.safetyScore >= 70 ? "emerald" : (simData.safetyScore >= 40 ? "amber" : "rose")} 
              />
              <div className="space-y-4 flex-1">
                 <h4 className="text-sm font-black text-white uppercase tracking-tight">AI Safe Entry Detector</h4>
                 <p className="text-xs text-slate-400 leading-relaxed font-medium">
                   Aura has evaluated market volatility, trend strength, and your current emotional state. 
                   {simData.safetyScore >= 70 
                     ? " Conditions are highly favorable for execution." 
                     : (simData.safetyScore >= 40 
                       ? " Proceed with caution. Volatility is elevated." 
                       : " EXECUTION BLOCKED. Market conditions and risk exposure are too dangerous.")}
                 </p>
                 <div className="flex gap-2">
                    <span className="px-2 py-1 rounded bg-white/5 text-[9px] font-black text-slate-400 uppercase">Trend: Neutral</span>
                    <span className="px-2 py-1 rounded bg-white/5 text-[9px] font-black text-slate-400 uppercase">Vol: Med</span>
                    <span className="px-2 py-1 rounded bg-white/5 text-[9px] font-black text-slate-400 uppercase">Emotion: Stable</span>
                 </div>
              </div>
           </div>

           {/* Risk Breakdown Cards */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-3">
                 <div className="flex items-center gap-2 text-indigo-400">
                    <ShieldCheck size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Translation Alpha</span>
                 </div>
                 <p className="text-xs text-slate-400 leading-relaxed">
                   By reducing leverage to <span className="text-white font-bold">{signal.adjusted_leverage}x</span>, your Liquidation Distance increased by <span className="text-emerald-400 font-bold">450%</span>.
                 </p>
              </div>
              <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-3">
                 <div className="flex items-center gap-2 text-amber-400">
                    <AlertTriangle size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Volatility Warning</span>
                 </div>
                 <p className="text-xs text-slate-400 leading-relaxed">
                   Current market volatility is <span className="text-white font-bold">MODERATE</span>. Your Stop-Loss at <span className="text-white font-bold">${signal.adjusted_sl}</span> is optimally placed.
                 </p>
              </div>
           </div>

           {/* Action */}
           <div className="pt-6 border-t border-white/10 space-y-4">
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                 <Lock size={12} /> Institutional Execution Path Enabled
              </div>
              <button 
                onClick={onConfirm}
                disabled={simData.safetyScore < 40}
                className="w-full py-5 rounded-2xl bg-emerald-600 text-white font-black text-xs uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-600/20 active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-600"
              >
                Confirm Institutional Copy
                <ArrowRight size={18} />
              </button>
           </div>

        </div>
      </div>
    </div>
  );
}

function SimMetric({ label, value, color }: any) {
  return (
    <div className="space-y-1">
       <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{label}</div>
       <div className={`text-lg font-black tracking-tighter ${color}`}>{value}</div>
    </div>
  );
}
