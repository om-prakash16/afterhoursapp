"use client";

import { useEffect, useState } from "react";
import { 
  ShieldCheck, 
  ShieldAlert, 
  Activity, 
  BarChart3, 
  TrendingUp, 
  Zap,
  Target,
  ArrowRight,
  Cpu,
  AlertTriangle
} from "lucide-react";
import { getPortfolioProtectionAudit } from "@/lib/api";

export default function ProtectionLayer() {
  const [audit, setAudit] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAudit = async () => {
      try {
        const data = await getPortfolioProtectionAudit();
        setAudit(data);
      } catch (err) {
        console.error("Protection audit failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAudit();
  }, []);

  if (loading || !audit) return null;

  return (
    <div className="glass-morphism rounded-[3rem] border border-white/10 p-10 space-y-10 bg-black/40 relative overflow-hidden group">
      {/* Background Glow */}
      <div className={`absolute top-0 right-0 w-32 h-32 blur-[60px] rounded-full opacity-20 transition-colors duration-1000 ${audit.health_score > 70 ? 'bg-emerald-500' : 'bg-rose-500'}`} />

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
           <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shadow-lg transition-colors ${audit.health_score > 70 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-emerald-500/10' : 'bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-rose-500/10'}`}>
              <ShieldCheck size={24} />
           </div>
           <div>
              <h3 className="text-xl font-black text-white uppercase tracking-tight">Portfolio Citadel</h3>
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Aggregate Protection Layer</div>
           </div>
        </div>
        <div className="text-right">
           <div className={`text-4xl font-black tracking-tighter ${audit.health_score > 70 ? 'text-emerald-400' : 'text-rose-400'}`}>
             {audit.health_score}%
           </div>
           <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Health Integrity</div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
         <AuditMetric label="Notional Exposure" value={`$${(audit.total_notional_exposure / 1000).toFixed(1)}k`} color="text-white" />
         <AuditMetric label="Survival Prob." value={audit.survival_probability} color={audit.survival_probability === 'HIGH' ? 'text-emerald-400' : 'text-amber-400'} />
         <AuditMetric label="Diversification" value={audit.diversification_index.toFixed(2)} color="text-indigo-400" />
         <AuditMetric label="Risk Protocol" value="ACTIVE" color="text-emerald-400" />
      </div>

      {/* Aura Recommendations */}
      <div className="space-y-4">
         <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
            <Cpu size={14} className="text-indigo-400" /> Aura Protection Protocols
         </div>
         
         {audit.recommendations.length > 0 ? (
           audit.recommendations.map((rec: any, i: number) => (
             <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-3 group/rec hover:bg-white/10 transition-all">
                <div className="flex justify-between items-center">
                   <div className="flex items-center gap-2">
                      {rec.type === 'LEVERAGE' ? <Zap size={14} className="text-rose-400" /> : <Target size={14} className="text-amber-400" />}
                      <span className="text-[10px] font-black text-white uppercase tracking-widest">{rec.type} REDUCTION REQUIRED</span>
                   </div>
                   <div className={`text-[8px] font-black px-2 py-0.5 rounded uppercase ${rec.severity === 'HIGH' ? 'bg-rose-500 text-white' : 'bg-amber-500 text-black'}`}>
                      {rec.severity}
                   </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                  {rec.message}
                </p>
                <button className="flex items-center gap-2 text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:text-white transition-colors">
                   Acknowledge & Execute <ArrowRight size={12} />
                </button>
             </div>
           ))
         ) : (
           <div className="p-8 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 text-center space-y-2">
              <div className="text-emerald-400 font-black text-xs uppercase tracking-widest">Citadel Integrity: Optimal</div>
              <p className="text-[10px] text-slate-500 font-medium">Your current exposure aligns perfectly with your Trade DNA. No intervention required.</p>
           </div>
         )}
      </div>

      {/* Heatmap Link (Micro Viz) */}
      <div className="pt-6 border-t border-white/5 flex items-center justify-between">
         <div className="flex items-center gap-3">
            <Activity size={16} className="text-slate-600" />
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Cross-Correlation: 0.24 (Low)</span>
         </div>
         <div className="flex items-center gap-1">
            <div className="w-1 h-1 rounded-full bg-emerald-500" />
            <div className="w-1 h-1 rounded-full bg-emerald-500 opacity-50" />
            <div className="w-1 h-1 rounded-full bg-emerald-500 opacity-20" />
         </div>
      </div>
    </div>
  );
}

function AuditMetric({ label, value, color }: any) {
  return (
    <div className="space-y-1">
       <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{label}</div>
       <div className={`text-sm font-black tracking-tighter ${color}`}>{value}</div>
    </div>
  );
}
