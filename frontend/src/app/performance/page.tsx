"use client";

import { useEffect, useState } from "react";
import { 
  ShieldCheck, 
  Target, 
  Brain, 
  Zap, 
  Activity, 
  TrendingUp, 
  AlertTriangle,
  Lock,
  ArrowRight,
  CheckCircle2,
  Cpu,
  BarChart3,
  Flame,
  Scale,
  Download
} from "lucide-react";
import { getRecoveryStatus, getTradeScores } from "@/lib/api";
import { SkeletonCard } from "@/components/ui/States";

export default function PerformancePage() {
  const [recovery, setRecovery] = useState<any>(null);
  const [scores, setScores] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rec, sco] = await Promise.all([
          getRecoveryStatus(),
          getTradeScores()
        ]);
        setRecovery(rec);
        setScores(sco);
      } catch (err) {
        console.error("Performance fetch failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading || !recovery || !scores) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center">
       <SkeletonCard />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 pb-20 pt-28 px-6 relative overflow-hidden">
      
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Smart Recovery Mode Alert */}
        {recovery.active && (
          <div className="glass-morphism rounded-[3rem] border border-rose-500/30 p-10 bg-rose-600/5 relative overflow-hidden animate-in slide-in-from-top-10 duration-700">
             <div className="absolute top-0 right-0 p-10 opacity-10">
                <ShieldCheck size={120} className="text-rose-500" />
             </div>
             <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                <div className="md:col-span-8 space-y-6 relative z-10">
                   <div className="flex items-center gap-3 text-rose-400">
                      <AlertTriangle size={32} className="animate-pulse" />
                      <h2 className="text-3xl font-black uppercase tracking-tighter">Smart Recovery Mode Active</h2>
                   </div>
                   <p className="text-slate-400 text-sm leading-relaxed max-w-2xl font-medium">
                     {recovery.guidance} Aura has detected high behavioral leakage. **Leverage is restricted to {recovery.restrictions.max_leverage}** and your trade frequency is capped at {recovery.restrictions.max_trades_per_day} per day.
                   </p>
                   <div className="flex flex-wrap gap-4 pt-2">
                      <RecoveryPill label="Loss Streak" value={recovery.consecutive_losses} icon={TrendingDownIcon} color="text-rose-400" />
                      <RecoveryPill label="Stability" value={`${recovery.emotional_stability}%`} icon={Brain} color="text-rose-400" />
                      <RecoveryPill label="Leverage Cap" value={recovery.restrictions.max_leverage} icon={Scale} color="text-rose-400" />
                   </div>
                   
                   {/* Emotional Recovery Assistant */}
                   <div className="mt-8 p-6 rounded-2xl bg-black/40 border border-rose-500/20 space-y-4">
                      <h4 className="text-sm font-black text-white uppercase tracking-tight flex items-center gap-2">
                         <Brain size={16} className="text-rose-400" /> Emotional Recovery Assistant
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed italic">
                        "Your heart rate spiked to 110bpm during the last exit. Take a 60-minute screen break. Step away from the terminal. Capital preservation is priority one."
                      </p>
                      <button className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2">
                         Acknowledge Protocol <CheckCircle2 size={12} />
                      </button>
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* Trade Score Engine Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
           
           {/* Summary Stats */}
           <div className="lg:col-span-4 space-y-8">
              <div className="glass-morphism rounded-[3rem] border border-white/10 p-10 bg-black/40 space-y-8">
                 <div className="space-y-1 text-center">
                    <div className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">Institutional Average</div>
                    <div className="text-7xl font-black text-white tracking-tighter">{scores.average_score}</div>
                    <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Global Performance Rating</div>
                 </div>
                 
                 <div className="pt-8 border-t border-white/5 space-y-6">
                    <div className="flex justify-between items-center">
                       <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Trend Analysis</span>
                       <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                          <TrendingUp size={12} /> {scores.trend}
                       </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed font-medium">
                       {scores.improvement_summary}
                    </p>
                 </div>
                 
                 <button className="w-full py-4 rounded-xl bg-white/5 border border-white/10 text-white font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2 group">
                    <Download size={14} className="group-hover:-translate-y-1 transition-transform" />
                    Download Insights PDF
                 </button>
              </div>

              <div className="glass-morphism rounded-[2.5rem] border border-indigo-500/20 p-8 space-y-6 bg-indigo-600/5">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg">
                       <Cpu size={20} />
                    </div>
                    <div>
                       <h4 className="text-sm font-black text-white uppercase tracking-tight">Scoring Audit</h4>
                       <div className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Neural Rating Active</div>
                    </div>
                 </div>
                 <div className="space-y-4">
                    <ScoreFactor label="Discipline" value="ELITE" />
                    <ScoreFactor label="Risk Management" value="OPTIMAL" />
                    <ScoreFactor label="Stability" value="VOLATILE" />
                 </div>
              </div>
           </div>

           {/* Recent Scores Grid */}
           <div className="lg:col-span-8 space-y-8">
              <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                 <BarChart3 size={20} className="text-indigo-400" /> Recent Execution Scores
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {scores.scores.map((score: any) => (
                   <div key={score.id} className="glass-morphism rounded-[2.5rem] border border-white/10 p-8 space-y-6 hover:bg-white/[0.03] transition-all group">
                      <div className="flex justify-between items-start">
                         <div className="space-y-1">
                            <div className="text-lg font-black text-white">{score.asset}</div>
                            <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Trade ID: #{score.id}</div>
                         </div>
                         <div className={`text-3xl font-black ${score.score >= 80 ? 'text-emerald-400' : (score.score >= 60 ? 'text-amber-400' : 'text-rose-400')}`}>
                            {score.score}
                         </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                         <MiniScore label="Disc." value={score.discipline} />
                         <MiniScore label="Risk" value={score.risk} />
                         <MiniScore label="Emo." value={score.emotion} />
                      </div>

                      <div className="pt-4 border-t border-white/5 flex justify-end">
                         <button className="text-[9px] font-black text-indigo-400 uppercase tracking-widest hover:text-white transition-colors flex items-center gap-1">
                            Full Analysis <ArrowRight size={10} />
                         </button>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

        </div>

      </div>
    </div>
  );
}

function RecoveryPill({ label, value, icon: Icon, color }: any) {
  return (
    <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
       <Icon size={14} className={color} />
       <div>
          <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">{label}</div>
          <div className={`text-xs font-black uppercase ${color}`}>{value}</div>
       </div>
    </div>
  );
}

function ScoreFactor({ label, value }: any) {
  return (
    <div className="flex justify-between items-center">
       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</span>
       <span className={`text-[10px] font-black uppercase tracking-widest ${value === 'ELITE' ? 'text-emerald-400' : (value === 'OPTIMAL' ? 'text-indigo-400' : 'text-rose-400')}`}>{value}</span>
    </div>
  );
}

function MiniScore({ label, value }: any) {
  return (
    <div className="text-center">
       <div className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">{label}</div>
       <div className="text-xs font-black text-white">{value}</div>
    </div>
  );
}

function TrendingDownIcon({ size, className }: any) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
      <polyline points="17 18 23 18 23 12" />
    </svg>
  );
}
