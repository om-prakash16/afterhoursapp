"use client";

import { useEffect, useState } from "react";
import { 
  ShieldCheck, 
  ShieldAlert, 
  Search, 
  AlertTriangle, 
  Activity, 
  TrendingUp, 
  Zap,
  Target,
  ArrowRight,
  Cpu,
  Fingerprint
} from "lucide-react";
import { getFraudAudit } from "@/lib/api";

export default function ForensicAudit({ provider }: { provider: string }) {
  const [audit, setAudit] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAudit = async () => {
      try {
        const data = await getFraudAudit(provider);
        setAudit(data);
      } catch (err) {
        console.error("Forensic audit failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAudit();
  }, [provider]);

  if (loading || !audit) return null;

  return (
    <div className="glass-morphism rounded-[2rem] border border-white/5 p-8 space-y-6 bg-black/20 relative overflow-hidden group">
      
      {/* Background Pulse for Warning */}
      {audit.status !== 'VERIFIED' && (
        <div className="absolute inset-0 bg-rose-600/5 animate-pulse -z-10" />
      )}

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
           <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-lg ${audit.status === 'VERIFIED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
              <Fingerprint size={20} />
           </div>
           <div>
              <h4 className="text-sm font-black text-white uppercase tracking-tight">Forensic Audit</h4>
              <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Aura Intelligence Unit</div>
           </div>
        </div>
        <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${audit.status === 'VERIFIED' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
           {audit.status}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
         <AuditStat label="Win Rate" value={`${audit.win_rate}%`} sub={audit.win_rate > 90 ? "UNREALISTIC" : "OPTIMAL"} color={audit.win_rate > 90 ? "text-rose-400" : "text-white"} />
         <AuditStat label="Avg. Leverage" value={`${audit.avg_leverage}x`} sub={audit.avg_leverage > 20 ? "HIGH RISK" : "CONSERVATIVE"} color={audit.avg_leverage > 20 ? "text-rose-400" : "text-white"} />
      </div>

      {audit.warning && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 space-y-2">
           <div className="flex items-center gap-2 text-rose-400">
              <AlertTriangle size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">Fraud Warning</span>
           </div>
           <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
             "{audit.warning}"
           </p>
        </div>
      )}

      <div className="pt-4 border-t border-white/5 flex items-center justify-between">
         <div className="flex items-center gap-2">
            <ShieldCheck size={12} className="text-slate-600" />
            <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Fake Activity Prob: {audit.fake_activity_prob}%</span>
         </div>
         <button className="text-[9px] font-black text-indigo-400 uppercase tracking-widest hover:text-white transition-colors">
            Full Audit <ArrowRight size={10} />
         </button>
      </div>
    </div>
  );
}

function AuditStat({ label, value, sub, color }: any) {
  return (
    <div className="space-y-1">
       <div className="text-[8px] font-black text-slate-600 uppercase tracking-widest">{label}</div>
       <div className={`text-sm font-black tracking-tighter ${color}`}>{value}</div>
       <div className="text-[8px] font-bold text-slate-500 uppercase tracking-tight">{sub}</div>
    </div>
  );
}
