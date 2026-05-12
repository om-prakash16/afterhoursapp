"use client";

import { useEffect, useState, use } from "react";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Brain, 
  AlertTriangle, 
  CheckCircle2, 
  Activity, 
  TrendingUp, 
  TrendingDown,
  Cpu,
  Target,
  Zap,
  ArrowRight,
  ChevronLeft
} from "lucide-react";
import { getTradeReplay } from "@/lib/api";
import Link from "next/link";

export default function ReplayPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [data, setData] = useState<any>(null);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReplay = async () => {
      try {
        const result = await getTradeReplay(parseInt(id));
        setData(result);
      } catch (err) {
        console.error("Replay fetch failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReplay();
  }, [id]);

  if (loading || !data) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center">
       <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
    </div>
  );

  const currentSnapshot = data.snapshots[step];

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 pb-20 pt-28 px-6 relative overflow-hidden">
      
      {/* Background Pulse */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/5 blur-[120px] rounded-full -z-10 animate-pulse" />

      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
           <div className="space-y-2">
              <Link href="/journal" className="text-slate-500 hover:text-white transition-colors flex items-center gap-2 text-xs font-black uppercase tracking-widest mb-4">
                 <ChevronLeft size={14} /> Back to Journal
              </Link>
              <h1 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">Forensic Replay: {data.asset}</h1>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-lg border border-white/10 inline-block">
                 Trade ID: #{id} • Forensic Mode Active
              </p>
           </div>
           <div className="flex items-center gap-4">
              <div className="text-right">
                 <div className={`text-2xl font-black ${data.final_pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {data.final_pnl >= 0 ? '+' : ''}${data.final_pnl}
                 </div>
                 <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Final Realized PnL</div>
              </div>
           </div>
        </div>

        {/* Main Replay Console */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
           
           {/* Visualizer (Left) */}
           <div className="lg:col-span-8 space-y-8">
              <div className="glass-morphism rounded-[3rem] border border-white/10 bg-black/40 p-12 aspect-video flex flex-col items-center justify-center relative group">
                 
                 {/* Replay Phase Label */}
                 <div className="absolute top-8 left-8 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                    <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">{currentSnapshot.phase}</span>
                 </div>

                 {/* Snapshot Data Visualization (Simplified) */}
                 <div className="text-center space-y-6">
                    <div className="text-6xl font-black text-white tracking-tighter">${currentSnapshot.price.toLocaleString()}</div>
                    <div className="flex items-center justify-center gap-8">
                       <SnapshotMetric label="Emotion" value={currentSnapshot.emotion} color={currentSnapshot.emotion === 'ZEN' ? 'text-emerald-400' : (currentSnapshot.emotion === 'ANXIOUS' ? 'text-amber-400' : 'text-white')} />
                       <SnapshotMetric label="Intensity" value={`${currentSnapshot.intensity}%`} color="text-indigo-400" />
                    </div>
                 </div>

                 {/* Step Navigation Overlay */}
                 <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6 p-4 rounded-3xl bg-black/60 border border-white/10 backdrop-blur-xl">
                    <button 
                      onClick={() => setStep(Math.max(0, step - 1))}
                      disabled={step === 0}
                      className="text-slate-400 hover:text-white transition-colors disabled:opacity-20"
                    >
                       <SkipBack size={24} fill="currentColor" />
                    </button>
                    <div className="flex items-center gap-1">
                       {data.snapshots.map((_: any, i: number) => (
                         <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${i === step ? 'w-6 bg-indigo-500' : 'bg-white/20'}`} />
                       ))}
                    </div>
                    <button 
                      onClick={() => setStep(Math.min(data.snapshots.length - 1, step + 1))}
                      disabled={step === data.snapshots.length - 1}
                      className="text-slate-400 hover:text-white transition-colors disabled:opacity-20"
                    >
                       <SkipForward size={24} fill="currentColor" />
                    </button>
                 </div>
              </div>

              {/* Snapshot Timeline Slider */}
              <div className="px-10">
                 <input 
                   type="range" 
                   min={0} 
                   max={data.snapshots.length - 1} 
                   value={step} 
                   onChange={(e) => setStep(parseInt(e.target.value))}
                   className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-indigo-600"
                 />
                 <div className="flex justify-between mt-4 text-[9px] font-black text-slate-600 uppercase tracking-widest">
                    <span>Entry</span>
                    <span>Progression</span>
                    <span>Exit</span>
                 </div>
              </div>
           </div>

           {/* Aura Commentary (Right) */}
           <div className="lg:col-span-4 space-y-8">
              
              <div className="glass-morphism rounded-[2.5rem] border border-indigo-500/20 p-8 space-y-6 bg-indigo-600/5 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Cpu size={60} className="text-indigo-400" />
                 </div>
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg">
                       <Brain size={20} />
                    </div>
                    <div>
                       <h4 className="text-sm font-black text-white uppercase tracking-tight">Retrospective Advice</h4>
                       <div className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Snapshot Analysis</div>
                    </div>
                 </div>
                 <p className="text-xs text-slate-400 leading-relaxed font-medium italic">
                   "{currentSnapshot.aura_advice}"
                 </p>
                 
                 {currentSnapshot.mistake && (
                   <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 space-y-2 animate-in slide-in-from-top-2">
                      <div className="flex items-center gap-2 text-rose-400">
                         <AlertTriangle size={14} />
                         <span className="text-[9px] font-black uppercase tracking-widest">Deviation Detected</span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-medium italic">
                        "{currentSnapshot.mistake}"
                      </p>
                   </div>
                 )}
              </div>

              <div className="glass-morphism rounded-[2.5rem] border border-white/10 p-8 space-y-6">
                 <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                    <Target size={14} className="text-indigo-400" /> Executive Summary
                 </h4>
                 <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                    {data.summary}
                 </p>
                 <button className="w-full py-4 rounded-xl bg-white/5 border border-white/10 text-white font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                    Archive Insights <CheckCircle2 size={14} />
                 </button>
              </div>

           </div>
        </div>

      </div>
    </div>
  );
}

function SnapshotMetric({ label, value, color }: any) {
  return (
    <div className="space-y-1">
       <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</div>
       <div className={`text-xl font-black ${color} tracking-tight uppercase`}>{value}</div>
    </div>
  );
}
