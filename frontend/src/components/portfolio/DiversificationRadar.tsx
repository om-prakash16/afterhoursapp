"use client";

import { useEffect, useState } from "react";
import { 
  PieChart as PieChartIcon, 
  Activity, 
  TrendingUp, 
  Zap, 
  ShieldCheck,
  AlertTriangle,
  Target,
  ArrowRight,
  Cpu,
  Layers
} from "lucide-react";
import { getDiversificationAudit } from "@/lib/api";

export default function DiversificationRadar() {
  const [audit, setAudit] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAudit = async () => {
      try {
        const data = await getDiversificationAudit();
        setAudit(data);
      } catch (err) {
        console.error("Diversification audit failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAudit();
  }, []);

  if (loading || !audit) return null;

  return (
    <div className="glass-morphism rounded-[3rem] border border-white/10 p-10 space-y-10 bg-black/40 relative overflow-hidden group">
      
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
           <div className="w-12 h-12 rounded-xl bg-indigo-600/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20 shadow-lg shadow-indigo-500/10">
              <Layers size={24} />
           </div>
           <div>
              <h3 className="text-xl font-black text-white uppercase tracking-tight">Diversification Radar</h3>
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sector Concentration Audit</div>
           </div>
        </div>
        <div className="text-right">
           <div className="text-4xl font-black text-white tracking-tighter">{audit.diversification_score}</div>
           <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Efficiency Score</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
         {/* Sector Allocation List */}
         <div className="space-y-6">
            {audit.allocation.map((item: any, i: number) => (
              <div key={i} className="space-y-2">
                 <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                    <span className="text-slate-400">{item.sector}</span>
                    <span className="text-white">{item.percent}%</span>
                 </div>
                 <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-1000"
                      style={{ width: `${item.percent}%`, backgroundColor: item.color }}
                    />
                 </div>
              </div>
            ))}
         </div>

         {/* Aura Intelligence Card */}
         <div className="p-8 rounded-[2.5rem] bg-indigo-600/5 border border-indigo-500/20 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
               <Cpu size={60} className="text-indigo-400" />
            </div>
            <div className="flex items-center gap-2 text-indigo-400">
               <AlertTriangle size={16} />
               <span className="text-[10px] font-black uppercase tracking-widest">Aura Optimization Protocol</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-medium italic">
              "{audit.recommendation}"
            </p>
            <div className="pt-4 flex items-center justify-between border-t border-white/5">
               <div className="flex items-center gap-2">
                  <Activity size={14} className="text-slate-600" />
                  <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Concentration: {audit.concentration_risk}</span>
               </div>
               <button className="text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:text-white transition-colors flex items-center gap-1">
                  Optimize Now <ArrowRight size={12} />
               </button>
            </div>
         </div>
      </div>

      {/* Correlation Matrix (Mini) */}
      <div className="pt-6 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-6">
         <CorrelationStat label="BTC : ETH" value={audit.correlation_matrix.BTC_ETH} status="HIGH" />
         <CorrelationStat label="BTC : SOL" value={audit.correlation_matrix.BTC_SOL} status="MED" />
         <CorrelationStat label="SOL : ETH" value={audit.correlation_matrix.SOL_ETH} status="MED" />
         <CorrelationStat label="AI : MEME" value={audit.correlation_matrix.AI_MEMES} status="LOW" />
      </div>
    </div>
  );
}

function CorrelationStat({ label, value, status }: any) {
  return (
    <div className="space-y-1">
       <div className="text-[8px] font-black text-slate-600 uppercase tracking-widest">{label}</div>
       <div className="flex items-center gap-2">
          <div className="text-sm font-black text-white">{value}</div>
          <div className={`text-[7px] font-black px-1 rounded uppercase ${status === 'HIGH' ? 'bg-rose-500/20 text-rose-400' : (status === 'MED' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400')}`}>
             {status}
          </div>
       </div>
    </div>
  );
}
