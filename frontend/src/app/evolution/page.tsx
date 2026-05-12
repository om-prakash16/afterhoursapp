"use client";

import { useEffect, useState } from "react";
import { 
  Trophy, 
  Target, 
  Brain, 
  Zap, 
  Shield, 
  Star,
  ArrowRight,
  Cpu,
  Activity,
  ChevronRight,
  TrendingUp
} from "lucide-react";
import { getGamificationProfile } from "@/lib/api";
import { SkeletonCard } from "@/components/ui/States";

export default function EvolutionPage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getGamificationProfile();
        setProfile(data);
      } catch (err) {
        console.error("Profile fetch failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading || !profile) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center">
       <SkeletonCard />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 pb-20 pt-28 px-6 relative overflow-hidden">
      {/* Background Evolution Particles */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
         <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-500/5 blur-[120px] rounded-full animate-pulse" />
         <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/5 blur-[120px] rounded-full animate-pulse-slow" />
      </div>

      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-2">
              <Star size={12} className="animate-spin-slow" /> Biological Resync Active
           </div>
           <h1 className="text-5xl font-black text-white tracking-tighter uppercase leading-none">Persona Evolution</h1>
           <p className="text-slate-500 max-w-xl mx-auto font-medium">
             Your trading persona evolves based on the three pillars of institutional excellence: Discipline, Emotional Clarity, and PnL Consistency.
           </p>
        </div>

        {/* Main Persona Card */}
        <div className="glass-morphism rounded-[3rem] border border-white/10 p-12 bg-black/40 relative overflow-hidden group">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                 <div className="space-y-2">
                    <div className="text-indigo-400 font-black text-xs uppercase tracking-widest">Current Rank</div>
                    <h2 className="text-4xl font-black text-white uppercase tracking-tight">{profile.persona.title}</h2>
                    <p className="text-sm text-slate-400 leading-relaxed font-medium">
                      {profile.persona.description}
                    </p>
                 </div>

                 <div className="space-y-4">
                    <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-widest">
                       <span>Evolution Progress</span>
                       <span>Level {profile.level}</span>
                    </div>
                    <div className="h-4 w-full bg-white/5 rounded-full border border-white/5 overflow-hidden p-1">
                       <div 
                         className="h-full bg-indigo-600 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(79,70,229,0.5)]"
                         style={{ width: `${(profile.xp / profile.xp_max) * 100}%` }}
                       />
                    </div>
                    <div className="text-[10px] text-right font-bold text-indigo-400/60 uppercase">
                       {profile.xp} / {profile.xp_max} XP TO LEVEL UP
                    </div>
                 </div>
              </div>

              <div className="relative flex justify-center">
                 {/* Visual Persona Avatar (Geometric/Minimalist) */}
                 <div className="w-64 h-64 rounded-full border-2 border-indigo-500/20 flex items-center justify-center relative">
                    <div className="absolute inset-0 bg-indigo-500/5 blur-[40px] rounded-full animate-pulse" />
                    <div className="w-48 h-48 rounded-full border-4 border-white/5 flex items-center justify-center relative">
                       <Cpu size={80} className="text-indigo-500 animate-float" />
                    </div>
                    {/* Evolution Nodes */}
                    <EvolutionNode angle={0} icon={Shield} color="text-emerald-400" />
                    <EvolutionNode angle={120} icon={Brain} color="text-indigo-400" />
                    <EvolutionNode angle={240} icon={TrendingUp} color="text-amber-400" />
                 </div>
              </div>
           </div>
        </div>

        {/* Evolution Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <MetricCard 
             label="Discipline" 
             value={profile.persona.evolution_metrics.discipline} 
             icon={Shield} 
             desc="Adherence to SL and leverage protocols."
             color="text-emerald-400"
           />
           <MetricCard 
             label="Emotional Clarity" 
             value={profile.persona.evolution_metrics.emotional_clarity} 
             icon={Brain} 
             desc="Zen stability during market volatility."
             color="text-indigo-400"
           />
           <MetricCard 
             label="PnL Consistency" 
             value={profile.persona.evolution_metrics.pnl_consistency} 
             icon={TrendingUp} 
             desc="Sustainability of profit cycles."
             color="text-amber-400"
           />
        </div>

        {/* Next Stage Teaser */}
        <div className="p-8 rounded-[2rem] bg-white/5 border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 group hover:bg-white/10 transition-all">
           <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                 <Zap size={32} />
              </div>
              <div>
                 <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Upcoming Evolution</div>
                 <div className="text-xl font-black text-white uppercase tracking-tight">Institutional Analyst</div>
              </div>
           </div>
           <button className="px-8 py-4 rounded-2xl bg-indigo-600 text-white font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20">
              View Requirements <ChevronRight size={16} />
           </button>
        </div>

      </div>
    </div>
  );
}

function EvolutionNode({ angle, icon: Icon, color }: any) {
  const x = Math.cos((angle * Math.PI) / 180) * 130;
  const y = Math.sin((angle * Math.PI) / 180) * 130;
  
  return (
    <div 
      className={`absolute w-12 h-12 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center shadow-2xl ${color}`}
      style={{ transform: `translate(${x}px, ${y}px)` }}
    >
       <Icon size={20} />
    </div>
  );
}

function MetricCard({ label, value, icon: Icon, desc, color }: any) {
  return (
    <div className="glass-morphism rounded-3xl border border-white/10 p-8 space-y-4 hover:-translate-y-2 transition-all duration-500">
       <div className="flex justify-between items-center">
          <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${color}`}>
             <Icon size={20} />
          </div>
          <div className={`text-2xl font-black ${color}`}>{value}%</div>
       </div>
       <div>
          <h4 className="text-xs font-black text-white uppercase tracking-widest mb-1">{label}</h4>
          <p className="text-[10px] text-slate-500 font-medium leading-relaxed">{desc}</p>
       </div>
       <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
          <div className={`h-full ${color} rounded-full opacity-60`} style={{ width: `${value}%` }} />
       </div>
    </div>
  );
}
