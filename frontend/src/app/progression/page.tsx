"use client";

import { useEffect, useState } from "react";
import { 
  Trophy, 
  Zap, 
  Shield, 
  Flame, 
  Star, 
  Target, 
  Medal, 
  Brain,
  Lock,
  ChevronRight,
  Sparkles
} from "lucide-react";

export default function ProgressionPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock for demo
    setTimeout(() => {
      setData({
        level: 4,
        xp: 650,
        xp_max: 4000,
        streak: 5,
        max_streak: 12,
        total_points: 12400,
        achievements: [
          { name: "Zen Master", icon: Brain, description: "5 trades with perfect emotional control.", rarity: "EPIC", unlocked: true },
          { name: "Safety First", icon: Shield, description: "Closed 10 trades with Stop Loss active.", rarity: "COMMON", unlocked: true },
          { name: "Alpha Hunter", icon: Zap, description: "First profitable trade on an Aura signal.", rarity: "RARE", unlocked: true },
          { name: "Market Titan", icon: Trophy, description: "Achieved $100k trading volume.", rarity: "LEGENDARY", unlocked: false },
          { name: "Consistent sniper", icon: Target, description: "Maintained 5-day trading streak.", rarity: "RARE", unlocked: true },
          { name: "Shield Bearer", icon: Shield, description: "Blocked 3 FOMO trades via Aura.", rarity: "EPIC", unlocked: false },
        ]
      });
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 pb-20 pt-28 px-6">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header with Level Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-4 flex items-center gap-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-[2.5rem] bg-indigo-600 flex items-center justify-center text-4xl font-black text-white shadow-2xl shadow-indigo-600/40 relative z-10">
                {data.level}
              </div>
              <div className="absolute -top-4 -right-4 w-12 h-12 rounded-2xl bg-amber-400 flex items-center justify-center text-slate-950 shadow-xl z-20">
                <Star size={24} fill="currentColor" />
              </div>
            </div>
            <div>
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Current Level</div>
              <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Elite Trader</h1>
              <div className="mt-2 flex items-center gap-2">
                <div className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-black text-indigo-400 uppercase tracking-widest">
                  Level {data.level} Pro
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 glass-morphism rounded-[3rem] border border-white/10 p-10 flex flex-col justify-center">
            <div className="flex justify-between items-end mb-4">
              <div>
                <span className="text-sm font-black text-white">{data.xp}</span>
                <span className="text-xs text-slate-500 ml-1">/ {data.xp_max} XP</span>
              </div>
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Next Level Unlocks: DNA Audit Pro</span>
            </div>
            <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-1">
              <div 
                className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(79,70,229,0.5)]"
                style={{ width: `${(data.xp / data.xp_max) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ProgressionStat label="Current Streak" value={`${data.streak} Days`} icon={Flame} color="text-rose-500" />
          <ProgressionStat label="Max Streak" value={`${data.max_streak} Days`} icon={Sparkles} color="text-amber-400" />
          <ProgressionStat label="Reward Points" value={data.total_points.toLocaleString()} icon={Medal} color="text-indigo-400" />
          <ProgressionStat label="Achievements" value={`${data.achievements.filter((a:any)=>a.unlocked).length}/${data.achievements.length}`} icon={Trophy} color="text-indigo-400" />
        </div>

        {/* Achievements Grid */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black text-white tracking-tighter uppercase flex items-center gap-3">
              <Award className="text-indigo-500" size={24} />
              Trader Achievements
            </h3>
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Ranked by Rarity</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.achievements.map((ach: any, i: number) => (
              <AchievementCard key={i} achievement={ach} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

function ProgressionStat({ label, value, icon: Icon, color }: any) {
  return (
    <div className="glass-morphism rounded-[2.5rem] border border-white/10 p-8 flex items-center gap-6 hover:border-white/20 transition-all group">
      <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center ${color} group-hover:scale-110 transition-transform`}>
        <Icon size={28} />
      </div>
      <div>
        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</div>
        <div className="text-2xl font-black text-white">{value}</div>
      </div>
    </div>
  );
}

function AchievementCard({ achievement: ach }: any) {
  const Icon = ach.icon;
  return (
    <div className={`glass-morphism rounded-[2.5rem] border p-8 flex flex-col items-center text-center space-y-4 transition-all relative overflow-hidden group ${
      ach.unlocked ? "border-white/10 hover:border-indigo-500/30" : "border-white/5 opacity-50 grayscale"
    }`}>
      {!ach.unlocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#020617]/40 backdrop-blur-[2px] z-10">
          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-slate-500">
            <Lock size={20} />
          </div>
        </div>
      )}
      
      <div className={`w-20 h-20 rounded-[2rem] bg-white/5 flex items-center justify-center ${
        ach.rarity === "LEGENDARY" ? "text-amber-400" : ach.rarity === "EPIC" ? "text-indigo-400" : "text-slate-400"
      } group-hover:scale-110 transition-transform`}>
        <Icon size={32} />
      </div>

      <div className="space-y-1">
        <div className={`text-[10px] font-black uppercase tracking-widest ${
          ach.rarity === "LEGENDARY" ? "text-amber-400" : ach.rarity === "EPIC" ? "text-indigo-400" : "text-slate-500"
        }`}>{ach.rarity} Achievement</div>
        <h4 className="text-lg font-bold text-white">{ach.name}</h4>
        <p className="text-xs text-slate-500 leading-relaxed max-w-[200px]">
          {ach.description}
        </p>
      </div>

      {ach.unlocked && (
        <div className="pt-4 flex items-center gap-2 text-[10px] font-black text-emerald-400 uppercase tracking-widest">
          <CheckCircle2 size={14} /> Unlocked
        </div>
      )}
    </div>
  );
}
