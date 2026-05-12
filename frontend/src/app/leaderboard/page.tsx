"use client";

import { useEffect, useState } from "react";
import { 
  Trophy, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Shield, 
  Brain, 
  Zap, 
  CheckCircle2,
  Medal,
  Award,
  Target
} from "lucide-react";
import { getLeaderboard } from "@/lib/api";

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await getLeaderboard();
        setLeaderboard(data);
      } catch (err) {
        console.error("Failed to fetch leaderboard", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Medal className="text-amber-400" size={32} />;
    if (rank === 2) return <Medal className="text-slate-400" size={28} />;
    if (rank === 3) return <Medal className="text-amber-700" size={24} />;
    return <span className="text-lg font-black text-slate-500">{rank}</span>;
  };

  const getBadgeIcon = (badge: string) => {
    switch (badge) {
      case "ZEN": return <div className="bg-indigo-500/10 text-indigo-400 p-1.5 rounded-lg border border-indigo-500/20" title="Emotional Control"><Brain size={14} /></div>;
      case "SNIPER": return <div className="bg-amber-500/10 text-amber-400 p-1.5 rounded-lg border border-amber-500/20" title="Precision Execution"><Target size={14} /></div>;
      case "SHIELD": return <div className="bg-emerald-500/10 text-emerald-400 p-1.5 rounded-lg border border-emerald-500/20" title="Risk Management"><Shield size={14} /></div>;
      case "WHALE": return <div className="bg-indigo-500/10 text-indigo-400 p-1.5 rounded-lg border border-indigo-500/20" title="High Volume"><Zap size={14} /></div>;
      default: return null;
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 pb-20 pt-28 px-6">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-indigo-400">
              <Trophy size={32} />
              <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Hall of Alpha</h1>
            </div>
            <p className="text-slate-500 max-w-xl font-medium">
              Ranking users by **Consistency Score**, not just PnL. The true test of a pro trader is discipline, safety, and emotional control.
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 flex items-center gap-4">
            <div className="text-right">
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Your Global Rank</div>
              <div className="text-2xl font-black text-white">#1,242</div>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <Award className="text-indigo-500" size={24} />
          </div>
        </div>

        {/* Podium / Top 3 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
          {leaderboard.slice(0, 3).map((user, i) => (
            <div key={user.rank} className={`glass-morphism rounded-[3rem] border border-white/10 p-10 flex flex-col items-center text-center relative overflow-hidden group hover:border-indigo-500/30 transition-all ${i === 0 ? "h-[450px] md:order-2 border-indigo-500/20" : "h-[400px] md:order-1"}`}>
              {i === 0 && <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />}
              
              <div className="mb-6 relative">
                <div className="w-24 h-24 rounded-[2rem] bg-slate-800 border-2 border-white/10 flex items-center justify-center text-3xl font-black text-white uppercase group-hover:scale-110 transition-transform">
                  {user.name.charAt(0)}
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-[#020617] border border-white/10 flex items-center justify-center shadow-2xl">
                  {getRankIcon(user.rank)}
                </div>
              </div>

              <div className="space-y-1 mb-6">
                <h3 className="text-xl font-bold text-white tracking-tight">{user.name}</h3>
                <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{user.archetype}</div>
              </div>

              <div className="grid grid-cols-2 gap-4 w-full mb-8">
                <div className="bg-white/5 rounded-2xl p-3 border border-white/5">
                  <div className="text-[9px] font-black text-slate-500 uppercase mb-1">Consistency</div>
                  <div className="text-lg font-black text-white">{user.score}%</div>
                </div>
                <div className="bg-white/5 rounded-2xl p-3 border border-white/5">
                  <div className="text-[9px] font-black text-slate-500 uppercase mb-1">Profit</div>
                  <div className="text-lg font-black text-emerald-400">{user.profit}</div>
                </div>
              </div>

              <div className="flex gap-2">
                {user.badges.map((b: string) => getBadgeIcon(b))}
              </div>
            </div>
          ))}
        </div>

        {/* Detailed Table for Rest */}
        <div className="glass-morphism rounded-[3rem] border border-white/10 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/5">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Global Rank</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Identity</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Safety & Discipline</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500 text-center">Achievements</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Consist. Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {leaderboard.slice(3).map((user) => (
                <tr key={user.rank} className="hover:bg-white/5 transition-all group">
                  <td className="px-8 py-8">
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-black text-slate-600 w-8">{user.rank}</span>
                      <div className="flex flex-col items-center">
                        {user.movement === "UP" ? <TrendingUp size={14} className="text-emerald-400" /> : user.movement === "DOWN" ? <TrendingDown size={14} className="text-rose-400" /> : <Minus size={14} className="text-slate-600" />}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-white/10 flex items-center justify-center font-bold text-white uppercase text-lg">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-lg text-white">{user.name}</div>
                        <div className="text-[10px] text-slate-500 font-bold uppercase">{user.archetype}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-8">
                    <div className="flex gap-8">
                      <div className="space-y-1">
                        <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Discipline</div>
                        <div className="text-sm font-bold text-white">{user.discipline}%</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Safety</div>
                        <div className="text-sm font-bold text-white">{user.safety}%</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Stability</div>
                        <div className="text-sm font-bold text-white">{user.emotional}%</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-8">
                    <div className="flex justify-center gap-2">
                      {user.badges.map((b: string) => getBadgeIcon(b))}
                    </div>
                  </td>
                  <td className="px-8 py-8 text-right">
                    <div className="text-2xl font-black text-indigo-400">{user.score}%</div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Professional Rating</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
