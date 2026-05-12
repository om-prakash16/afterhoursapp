"use client";

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

const data = [
  { time: '00:00', value: 400 },
  { time: '04:00', value: 300 },
  { time: '08:00', value: 600 },
  { time: '12:00', value: 800 },
  { time: '16:00', value: 500 },
  { time: '20:00', value: 900 },
  { time: '23:59', value: 1100 },
];

export default function MarketChart() {
  return (
    <div className="w-full h-[300px] glass rounded-2xl p-6 relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500/0 via-emerald-500/50 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider">Trading Volume</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">$12.4M</span>
            <span className="text-emerald-400 text-sm font-bold">+18.2%</span>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] text-emerald-500 font-bold tracking-widest uppercase">Live Analysis</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height="70%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="time" 
            hide 
          />
          <YAxis 
            hide 
            domain={['dataMin - 100', 'dataMax + 100']} 
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(15, 23, 42, 0.9)', 
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              fontSize: '12px'
            }}
            itemStyle={{ color: '#10b981' }}
          />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke="#10b981" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorValue)" 
            animationDuration={2000}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
