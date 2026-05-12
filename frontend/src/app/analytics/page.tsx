"use client";

import { useEffect, useState } from "react";
import { 
  Brain, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  History,
  Zap,
  Target,
  ShieldAlert,
  ArrowRight,
  Activity,
  Flame,
  ShieldCheck
} from "lucide-react";
import { 
  AreaChart, 
  Area,
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";
import { getBehavioralTimeline } from "@/lib/api";

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [timeline, setTimeline] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [behavioralData, timelineData] = await Promise.all([
          // In a real app, fetch from /analytics/behavioral/{id}
          new Promise(resolve => setTimeout(() => resolve({
            revenge_trading_score: 25,
            overtrading_frequency: "Normal",
            sizing_consistency: 88,
            panic_exit_rate: 12,
            discipline_score: 92,
            radar_data: [
              { subject: 'Discipline', A: 92, fullMark: 100 },
              { subject: 'Patience', A: 78, fullMark: 100 },
              { subject: 'Risk Control', A: 95, fullMark: 100 },
              { subject: 'Emotional Logic', A: 85, fullMark: 100 },
              { subject: 'Consistency', A: 88, fullMark: 100 },
            ],
            insights: [
              "Your sizing is highly consistent, which indicates strong discipline.",
              "Rare instances of revenge trading detected after BTC volatility.",
              "Your 'Aggressive Scalper' profile is currently well-balanced."
            ],
            risk_patterns: [
              { name: 'FOMO', value: 2, color: '#6366f1' },
              { name: 'Revenge', value: 1, color: '#f43f5e' },
              { name: 'Panic', value: 0, color: '#10b981' },
            ]
          }), 500)),
          getBehavioralTimeline()
        ]);
        setData(behavioralData);
        setTimeline(timelineData);
      } catch (err) {
        console.error("Failed to fetch analytics", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 pb-20 pt-28 px-6">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Mindset Integrity Audit */}
        <div className="glass-morphism rounded-[3rem] border border-white/10 p-12 flex flex-col md:flex-row items-center gap-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-600/5 blur-[100px] rounded-full -z-10" />
          
          <div className="relative w-48 h-48 shrink-0">
             <svg className="w-full h-full transform -rotate-90">
               <circle 
                 cx="96" cy="96" r="88" 
                 stroke="currentColor" strokeWidth="12" fill="transparent" 
                 className="text-white/5"
               />
               <circle 
                 cx="96" cy="96" r="88" 
                 stroke="currentColor" strokeWidth="12" fill="transparent" 
                 strokeDasharray={552.92}
                 strokeDashoffset={552.92 * (1 - 0.89)}
                 className="text-indigo-500"
                 strokeLinecap="round"
               />
             </svg>
             <div className="absolute inset-0 flex flex-col items-center justify-center">
               <div className="text-5xl font-black text-white">89<span className="text-xl text-indigo-400">%</span></div>
               <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Integrity</div>
             </div>
          </div>

          <div className="space-y-6 flex-1">
             <div className="space-y-2">
               <h2 className="text-3xl font-black text-white tracking-tighter uppercase">Mindset Integrity Audit</h2>
               <p className="text-slate-400 font-medium leading-relaxed">
                 Aura has analyzed 42 execution parameters. Your current mental alignment with your **Precision Architect** DNA is **Elite**. No major behavioral drifts detected in the last 72 hours.
               </p>
             </div>
             <div className="flex flex-wrap gap-4">
                <IntegrityPill label="Consistency" value="OPTIMAL" color="text-emerald-400" />
                <IntegrityPill label="Stability" value="STABLE" color="text-indigo-400" />
                <IntegrityPill label="Risk Guard" value="ACTIVE" color="text-amber-400" />
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Radar Chart: Psychological Balance */}
          <div className="lg:col-span-5 glass-morphism rounded-[3rem] border border-white/10 p-10 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-0 left-0 p-8">
              <h3 className="text-lg font-bold text-white tracking-tight">Psychological Balance</h3>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Aura Performance Radar</p>
            </div>
            <div className="w-full h-[400px] mt-10">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data.radar_data}>
                  <PolarGrid stroke="#1e293b" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }} />
                  <Radar
                    name="Performance"
                    dataKey="A"
                    stroke="#6366f1"
                    fill="#6366f1"
                    fillOpacity={0.5}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Right Column: Patterns and Insights */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Pattern Detection Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <PatternCard 
                label="Revenge Risk" 
                value={`${data.revenge_trading_score}%`} 
                status={data.revenge_trading_score < 30 ? "LOW" : "HIGH"}
                icon={Zap}
              />
              <PatternCard 
                label="Overtrading" 
                value={data.overtrading_frequency} 
                status="NORMAL"
                icon={History}
              />
              <PatternCard 
                label="Sizing Consistency" 
                value={`${data.sizing_consistency}%`} 
                status="STABLE"
                icon={Target}
              />
            </div>

            {/* Trading Habit Insights Engine */}
            <div className="glass-morphism rounded-[3rem] border border-white/10 p-10 space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 shadow-lg shadow-amber-500/10 border border-amber-500/20">
                  <Flame size={20} />
                </div>
                <div>
                   <h3 className="text-xl font-bold text-white tracking-tight">Trading Habit Insights</h3>
                   <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Behavioral Pattern Discovery</div>
                </div>
              </div>
              
              <div className="space-y-4">
                 <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                    <div className="flex items-center gap-2 text-rose-400">
                       <Zap size={14} />
                       <span className="text-[10px] font-black uppercase tracking-widest">Late-Night Overtrading</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed font-medium">
                       You execute <span className="text-white font-bold">45%</span> of your losing trades between 11 PM and 2 AM. Aura recommends enforcing a sleep-lock protocol during these hours.
                    </p>
                 </div>
                 
                 <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                    <div className="flex items-center gap-2 text-amber-400">
                       <Target size={14} />
                       <span className="text-[10px] font-black uppercase tracking-widest">Oversized Leverage</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed font-medium">
                       After a loss &gt; $500, your average leverage increases from 5x to <span className="text-white font-bold">18x</span>. This indicates a revenge-trading habit.
                    </p>
                 </div>
                 
                 <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-2">
                    <div className="flex items-center gap-2 text-emerald-400">
                       <ShieldCheck size={14} />
                       <span className="text-[10px] font-black uppercase tracking-widest">Strength: Volatility Patience</span>
                    </div>
                    <p className="text-xs text-emerald-500/70 leading-relaxed font-medium">
                       You rarely panic-sell during 15m candle wicks. Your emotional stability during high volatility is <span className="text-emerald-400 font-bold">Top 5%</span>.
                    </p>
                 </div>
              </div>

              <button className="w-full py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-3 mt-4">
                Generate Full Habit Report
                <ArrowRight size={16} />
              </button>
            </div>

          </div>

        </div>

        {/* Cognitive Pulse: Behavioral Timeline */}
        <div className="glass-morphism rounded-[3rem] border border-white/10 p-10 space-y-10 bg-black/40 relative overflow-hidden">
           <div className="flex justify-between items-center">
              <div className="space-y-1">
                 <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                    <Activity size={20} className="text-rose-500 animate-pulse" />
                    Cognitive Pulse
                 </h3>
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Correlated Emotional Intensity & Execution</p>
              </div>
              <div className="text-right">
                 <div className="text-2xl font-black text-white">{timeline.stability_index}%</div>
                 <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Stability Index</div>
              </div>
           </div>

           <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={timeline.events}>
                    <defs>
                       <linearGradient id="colorIntensity" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                       </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis 
                      dataKey="time" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: "#64748b", fontSize: 10, fontWeight: 'bold' }} 
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: "#64748b", fontSize: 10 }} 
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" }}
                      itemStyle={{ color: "#f43f5e" }}
                      labelStyle={{ color: "#fff", fontWeight: 'bold', marginBottom: '4px' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="intensity" 
                      stroke="#f43f5e" 
                      strokeWidth={3} 
                      fillOpacity={1} 
                      fill="url(#colorIntensity)" 
                    />
                 </AreaChart>
              </ResponsiveContainer>
           </div>

           {/* Pattern Alerts */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {timeline.patterns.map((pattern: any, i: number) => (
                <div key={i} className={`p-6 rounded-2xl border flex gap-4 ${pattern.severity === 'HIGH' ? 'bg-rose-500/10 border-rose-500/20' : 'bg-amber-500/10 border-amber-500/20'}`}>
                   <div className={`mt-1 ${pattern.severity === 'HIGH' ? 'text-rose-400' : 'text-amber-400'}`}>
                      <AlertTriangle size={20} />
                   </div>
                   <div className="space-y-1">
                      <div className="text-[10px] font-black text-white uppercase tracking-widest">{pattern.type.replace('_', ' ')} Detected</div>
                      <p className="text-xs text-slate-400 leading-relaxed font-medium">
                        {pattern.message}
                      </p>
                   </div>
                </div>
              ))}
           </div>
        </div>

      </div>
    </div>
  );
}

function PatternCard({ label, value, status, icon: Icon }: any) {
  return (
    <div className="glass-morphism rounded-[2rem] border border-white/10 p-6 space-y-4 hover:border-indigo-500/30 transition-all group">
      <div className="flex justify-between items-start">
        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-indigo-400 transition-colors">
          <Icon size={20} />
        </div>
        <div className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
          status === "LOW" || status === "STABLE" || status === "NORMAL" 
          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
          : "bg-rose-500/10 border-rose-500/20 text-rose-400"
        }`}>
          {status}
        </div>
      </div>
      <div className="space-y-1">
        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</div>
        <div className="text-2xl font-black text-white">{value}</div>
      </div>
    </div>
  );
}
function IntegrityPill({ label, value, color }: any) {
  return (
    <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
      <div className={`w-2 h-2 rounded-full bg-current ${color}`} />
      <div>
        <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none">{label}</div>
        <div className={`text-xs font-black uppercase ${color}`}>{value}</div>
      </div>
    </div>
  );
}
