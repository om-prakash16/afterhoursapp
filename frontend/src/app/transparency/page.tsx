"use client";

import { useEffect, useState } from "react";
import { 
  ShieldCheck, 
  Target, 
  Brain, 
  Zap, 
  Cpu, 
  Info, 
  ChevronRight, 
  Activity, 
  BarChart3,
  Lock,
  ArrowRight
} from "lucide-react";
import { getExplainabilityAudit } from "@/lib/api";
import { SkeletonCard } from "@/components/ui/States";

export default function TransparencyPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAudit = async () => {
      try {
        const result = await getExplainabilityAudit();
        setData(result);
      } catch (err) {
        console.error("Audit fetch failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAudit();
  }, []);

  if (loading || !data) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center">
       <SkeletonCard />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 pb-20 pt-28 px-6 relative overflow-hidden">
      
      {/* Background Neural Network Overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
         <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent" />
      </div>

      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-2">
              <Cpu size={12} className="animate-spin-slow" /> Forensic Logic Active
           </div>
           <h1 className="text-5xl font-black text-white tracking-tighter uppercase leading-none">Transparency Portal</h1>
           <p className="text-slate-500 max-w-xl mx-auto font-medium">
             Demystifying the "Black Box." Every decision Aura makes is backed by a verifiable reasoning chain. No mystery, just institutional logic.
           </p>
        </div>

        {/* Decisions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {data.decisions.map((item: any, i: number) => (
             <div key={i} className="glass-morphism rounded-[3rem] border border-white/10 p-10 space-y-8 bg-black/40 hover:bg-white/[0.03] transition-all group relative overflow-hidden">
                
                <div className="flex justify-between items-start">
                   <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-indigo-600/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20 shadow-lg group-hover:scale-110 transition-transform">
                         {getIcon(item.module)}
                      </div>
                      <div>
                         <h3 className="text-lg font-black text-white uppercase tracking-tight">{item.module}</h3>
                         <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Logic Audit {item.confidence}% Conf.</div>
                      </div>
                   </div>
                   <div className="bg-white/5 px-3 py-1 rounded-lg border border-white/10 text-[10px] font-black text-slate-500 uppercase">
                      {item.decision}
                   </div>
                </div>

                <div className="space-y-4">
                   <div className="flex items-center gap-2 text-slate-500">
                      <Info size={14} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Aura Reasoning Chain</span>
                   </div>
                   <p className="text-sm text-slate-400 leading-relaxed font-medium italic">
                     "{item.reasoning}"
                   </p>
                </div>

                {/* Forensic Data Points */}
                <div className="pt-6 border-t border-white/5 space-y-4">
                   <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Forensic Data Points</div>
                   <div className="flex flex-wrap gap-3">
                      {item.data_points.map((point: string, idx: number) => (
                        <div key={idx} className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[10px] font-bold text-white">
                           {point}
                        </div>
                      ))}
                   </div>
                </div>

             </div>
           ))}
        </div>

        {/* Global Logic Footer */}
        <div className="p-10 rounded-[3rem] bg-indigo-600/5 border border-indigo-500/20 flex flex-col md:flex-row items-center justify-between gap-8 group">
           <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-3xl bg-indigo-600 flex items-center justify-center text-white shadow-2xl shadow-indigo-500/40 border border-white/20 group-hover:rotate-12 transition-transform">
                 <Cpu size={32} />
              </div>
              <div>
                 <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Swarm Consensus Logic</div>
                 <p className="text-lg font-black text-white tracking-tight leading-snug">
                    {data.global_logic}
                 </p>
              </div>
           </div>
           <button className="px-10 py-5 rounded-2xl bg-white text-black font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center gap-3">
              Request Full Audit Log <ArrowRight size={18} />
           </button>
        </div>

      </div>
    </div>
  );
}

function getIcon(module: string) {
  if (module.includes("Sizing")) return <Target size={24} />;
  if (module.includes("Stop-Loss")) return <Zap size={24} />;
  if (module.includes("Risk")) return <ShieldCheck size={24} />;
  if (module.includes("Confidence")) return <Activity size={24} />;
  return <Cpu size={24} />;
}
