"use client";

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { ShieldAlert, TrendingUp } from "lucide-react";

export default function RiskForecastChart() {
  // Simulated forecast data
  const data = [
    { day: "Today", expected: 10000, worstCase: 9800, bestCase: 10200 },
    { day: "Day 1", expected: 10050, worstCase: 9600, bestCase: 10400 },
    { day: "Day 2", expected: 10100, worstCase: 9400, bestCase: 10600 },
    { day: "Day 3", expected: 10080, worstCase: 9100, bestCase: 10800 },
    { day: "Day 4", expected: 10150, worstCase: 8900, bestCase: 11000 },
    { day: "Day 5", expected: 10200, worstCase: 8500, bestCase: 11500 },
  ];

  return (
    <div className="glass-morphism rounded-[3rem] border border-white/10 p-10 space-y-8 bg-black/40">
      
      <div className="flex justify-between items-start">
         <div className="space-y-1">
            <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
               <ShieldAlert size={20} className="text-rose-400" />
               Smart Risk Forecast
            </h3>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">5-Day Danger Probability Matrix</p>
         </div>
         <div className="text-right">
            <div className="text-2xl font-black text-white">15%</div>
            <div className="text-[10px] font-black text-rose-400 uppercase tracking-widest">Max Drawdown Prob.</div>
         </div>
      </div>

      <div className="h-[300px] w-full">
         <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
               <defs>
                  <linearGradient id="colorWorst" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                     <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorBest" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                     <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
               </defs>
               <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
               <XAxis 
                 dataKey="day" 
                 axisLine={false} 
                 tickLine={false} 
                 tick={{ fill: "#64748b", fontSize: 10, fontWeight: 'bold' }} 
               />
               <YAxis 
                 axisLine={false} 
                 tickLine={false} 
                 tick={{ fill: "#64748b", fontSize: 10 }} 
                 domain={['auto', 'auto']}
               />
               <Tooltip 
                 contentStyle={{ backgroundColor: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" }}
                 itemStyle={{ color: "#e2e8f0", fontSize: "12px", fontWeight: "bold" }}
                 labelStyle={{ color: "#64748b", fontSize: "10px", textTransform: "uppercase", marginBottom: "8px" }}
               />
               
               {/* Danger Band */}
               <Area 
                 type="monotone" 
                 dataKey="worstCase" 
                 stroke="#f43f5e" 
                 fillOpacity={1} 
                 fill="url(#colorWorst)" 
                 strokeWidth={2}
                 name="Worst Case Risk"
               />
               {/* Expected Band */}
               <Area 
                 type="monotone" 
                 dataKey="expected" 
                 stroke="#6366f1" 
                 fill="transparent" 
                 strokeWidth={2}
                 strokeDasharray="5 5"
                 name="Expected Trajectory"
               />
            </AreaChart>
         </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-4">
         <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Forecast Insight</div>
            <p className="text-xs text-slate-400 font-medium">Volatility is expanding. Consider trimming BTC exposure by <span className="text-white">10%</span> to reduce worst-case drawdown.</p>
         </div>
         <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/20">
            <div className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-1">Danger Zone</div>
            <p className="text-xs text-rose-400/80 font-medium">Day 5 probability of exceeding your personal 10% risk threshold is currently <span className="text-rose-400 font-bold">elevated</span>.</p>
         </div>
      </div>

    </div>
  );
}
