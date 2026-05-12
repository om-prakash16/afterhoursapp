"use client";

import { useEffect, useState } from "react";
import { 
  User, 
  Shield, 
  Brain, 
  Zap, 
  Trophy, 
  BarChart3, 
  Settings, 
  Mail, 
  MapPin, 
  Calendar,
  Lock,
  Award,
  Star,
  Activity,
  HeartPulse
} from "lucide-react";
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  ResponsiveContainer 
} from "recharts";
import { getMyDNA, getUserRiskScore, getPortfolioSummary } from "@/lib/api";

export default function ProfilePage() {
  const [dna, setDna] = useState<any>(null);
  const [risk, setRisk] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    const fetchData = async () => {
      try {
        const [dnaData, riskData, portData] = await Promise.all([
          getMyDNA().catch(() => null),
          getUserRiskScore().catch(() => null),
          getPortfolioSummary().catch(() => null)
        ]);
        setDna(dnaData);
        setRisk(riskData);
        setStats(portData);
      } catch (err) {
        console.error("Profile fetch error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const radarData = dna ? [
    { subject: 'Risk', A: dna.risk_tolerance * 100 },
    { subject: 'Patience', A: dna.patience * 100 },
    { subject: 'Discipline', A: dna.discipline * 100 },
    { subject: 'Aggression', A: dna.aggression * 100 },
    { subject: 'Control', A: dna.emotional_control * 100 },
  ] : [];

  if (loading) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 pb-20 pt-28 px-6 overflow-hidden">
      
      {/* Background Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] bg-indigo-600/10 blur-[150px] rounded-full -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-emerald-600/5 blur-[120px] rounded-full -z-10" />

      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row gap-10 items-start">
          <div className="relative shrink-0">
             <div className="w-40 h-40 rounded-[3rem] bg-slate-800 border-2 border-white/10 flex items-center justify-center text-5xl font-black text-white uppercase shadow-2xl">
               {user?.full_name?.charAt(0) || "U"}
             </div>
             <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xl border-4 border-[#020617]">
               <Shield size={24} />
             </div>
          </div>

          <div className="flex-1 space-y-6">
            <div className="space-y-1">
              <div className="flex items-center gap-4">
                <h1 className="text-5xl font-black text-white tracking-tighter uppercase">{user?.full_name}</h1>
                <div className="px-3 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">Verified Commander</div>
              </div>
              <div className="flex items-center gap-6 text-slate-500 text-sm font-medium">
                <span className="flex items-center gap-2"><Mail size={16} /> {user?.email}</span>
                <span className="flex items-center gap-2"><MapPin size={16} /> Global Node</span>
                <span className="flex items-center gap-2"><Calendar size={16} /> Active since May 2024</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4">
               <ProfilePill icon={Zap} label="Archetype" value={dna?.archetype || "Analyzing..."} color="text-amber-400" />
               <ProfilePill icon={Activity} label="Risk Rating" value={risk?.status || "MODERATE"} color="text-indigo-400" />
               <ProfilePill icon={HeartPulse} label="Stability" value="94.2%" color="text-emerald-400" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: DNA & Risk */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Trade DNA Card */}
            <div className="glass-morphism rounded-[3rem] border border-white/10 p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-black text-white tracking-tight uppercase flex items-center gap-3">
                    <Brain size={24} className="text-indigo-500" />
                    Psychological DNA
                  </h3>
                  <p className="text-sm text-slate-500 mt-2">
                    Your trading personality is mathematically encoded into Aura. This profile governs all signal translations.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                    <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Primary Style</div>
                    <div className="text-lg font-bold text-white uppercase">{dna?.archetype}</div>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed italic">
                    "{dna?.description}"
                  </p>
                </div>
              </div>

              <div className="h-[300px] w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                    <PolarGrid stroke="#334155" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: "#64748b", fontSize: 10, fontWeight: 900 }} />
                    <Radar
                      name="User DNA"
                      dataKey="A"
                      stroke="#6366f1"
                      fill="#6366f1"
                      fillOpacity={0.5}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Performance Snapshot */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="glass-morphism rounded-[2.5rem] border border-white/10 p-8 space-y-4">
                 <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                   <BarChart3 size={14} className="text-emerald-400" /> 
                   Execution Performance
                 </h4>
                 <div className="grid grid-cols-2 gap-6">
                   <div>
                     <div className="text-2xl font-black text-white">{stats?.win_rate || "74.2"}%</div>
                     <div className="text-[9px] font-black text-slate-600 uppercase">Win Rate</div>
                   </div>
                   <div>
                     <div className="text-2xl font-black text-white">2.4</div>
                     <div className="text-[9px] font-black text-slate-600 uppercase">Profit Factor</div>
                   </div>
                 </div>
               </div>

               <div className="glass-morphism rounded-[2.5rem] border border-white/10 p-8 space-y-4">
                 <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                   <Shield size={14} className="text-indigo-400" /> 
                   Risk Discipline
                 </h4>
                 <div className="grid grid-cols-2 gap-6">
                   <div>
                     <div className="text-2xl font-black text-white">{risk?.score || "88"}</div>
                     <div className="text-[9px] font-black text-slate-600 uppercase">Safety Score</div>
                   </div>
                   <div>
                     <div className="text-2xl font-black text-rose-400">-{stats?.max_drawdown || "4.2"}%</div>
                     <div className="text-[9px] font-black text-slate-600 uppercase">Max Drawdown</div>
                   </div>
                 </div>
               </div>
            </div>

          </div>

          {/* Right Column: Achievements & Stats */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Level & XP */}
            <div className="glass-morphism rounded-[2.5rem] border border-white/10 p-8 space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-xl">4</div>
                  <div>
                    <div className="text-[10px] font-black text-slate-500 uppercase">Current Level</div>
                    <div className="text-sm font-bold text-white">Elite Trader</div>
                  </div>
                </div>
                <Star size={20} className="text-amber-400 fill-amber-400" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                   <span className="text-slate-500">650 / 4000 XP</span>
                   <span className="text-indigo-400">16% to Level 5</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                   <div className="h-full bg-indigo-500 rounded-full" style={{ width: '16%' }} />
                </div>
              </div>
            </div>

            {/* Achievements Showcase */}
            <div className="glass-morphism rounded-[2.5rem] border border-white/10 p-8 space-y-6">
               <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                 <Trophy size={16} className="text-indigo-500" />
                 Elite Achievements
               </h3>
               <div className="grid grid-cols-2 gap-4">
                  <AchievementMini name="Zen Master" icon={Brain} rarity="EPIC" />
                  <AchievementMini name="Shield" icon={Shield} rarity="COMMON" />
                  <AchievementMini name="Sniper" icon={Zap} rarity="RARE" />
                  <div className="aspect-square rounded-2xl bg-white/5 border border-white/5 border-dashed flex items-center justify-center text-slate-700">
                    <Lock size={20} />
                  </div>
               </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

function ProfilePill({ icon: Icon, label, value, color }: any) {
  return (
    <div className="px-5 py-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4 group hover:bg-white/10 transition-all">
      <div className={`w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center ${color} group-hover:scale-110 transition-transform`}>
        <Icon size={16} />
      </div>
      <div>
        <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{label}</div>
        <div className="text-sm font-bold text-white tracking-tight">{value}</div>
      </div>
    </div>
  );
}

function AchievementMini({ name, icon: Icon, rarity }: any) {
  return (
    <div className="aspect-square rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center gap-2 group hover:border-indigo-500/30 transition-all cursor-pointer">
      <div className={`text-slate-400 group-hover:scale-110 transition-transform ${
        rarity === "EPIC" ? "text-indigo-400" : rarity === "RARE" ? "text-amber-400" : "text-slate-400"
      }`}>
        <Icon size={24} />
      </div>
      <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{name}</div>
    </div>
  );
}
