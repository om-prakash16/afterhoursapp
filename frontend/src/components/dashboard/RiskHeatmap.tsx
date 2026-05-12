"use client";

import { useState, useEffect } from "react";
import { 
  ShieldAlert, 
  Activity, 
  Flame, 
  Zap,
  TrendingUp,
  Cpu
} from "lucide-react";

export default function RiskHeatmap() {
  const [cells, setCells] = useState<any[]>([]);

  useEffect(() => {
    // Generate a 6x6 grid of neural risk cells
    const newCells = Array.from({ length: 36 }).map((_, i) => ({
      id: i,
      level: Math.random() * 100,
      label: i % 5 === 0 ? "VOLATILITY" : (i % 3 === 0 ? "EXPOSURE" : "STABILITY")
    }));
    setCells(newCells);

    const interval = setInterval(() => {
      setCells(prev => prev.map(c => ({
        ...c,
        level: Math.max(10, Math.min(95, c.level + (Math.random() - 0.5) * 10))
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-morphism rounded-[3rem] border border-white/10 p-10 space-y-8 bg-black/40 relative overflow-hidden group">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500 border border-rose-500/20">
              <ShieldAlert size={20} />
           </div>
           <h3 className="text-xl font-black text-white uppercase tracking-tight">Perimeter Heatmap</h3>
        </div>
        <div className="flex items-center gap-2">
           <div className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
           <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest">Scanning Neural Leaks</span>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="grid grid-cols-6 gap-2">
         {cells.map(cell => (
           <div 
             key={cell.id}
             className="aspect-square rounded-lg transition-all duration-1000 relative group/cell"
             style={{ 
               backgroundColor: cell.level > 80 ? 'rgba(244, 63, 94, 0.4)' : (cell.level > 50 ? 'rgba(245, 158, 11, 0.2)' : 'rgba(99, 102, 241, 0.1)'),
               border: `1px solid ${cell.level > 80 ? 'rgba(244, 63, 94, 0.3)' : 'rgba(255, 255, 255, 0.05)'}`
             }}
           >
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/cell:opacity-100 transition-opacity">
                 <div className="text-[6px] font-black text-white uppercase tracking-tighter text-center">
                    {Math.round(cell.level)}%<br/>{cell.label}
                 </div>
              </div>
              {cell.level > 90 && (
                <div className="absolute inset-0 bg-rose-500/20 animate-pulse rounded-lg" />
              )}
           </div>
         ))}
      </div>

      {/* Risk Metrics */}
      <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/5">
         <div className="space-y-1">
            <div className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Global Exposure</div>
            <div className="text-sm font-black text-white">4.2x <span className="text-[8px] text-emerald-400">SAFE</span></div>
         </div>
         <div className="space-y-1 text-center">
            <div className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Survival Rate</div>
            <div className="text-sm font-black text-white">98.2%</div>
         </div>
         <div className="space-y-1 text-right">
            <div className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Stress Sync</div>
            <div className="text-sm font-black text-amber-400">ELEVATED</div>
         </div>
      </div>

      {/* Aura Insight */}
      <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4 group/insight">
         <Cpu size={16} className="text-indigo-400 group-hover:rotate-180 transition-transform duration-700" />
         <p className="text-[10px] text-slate-400 font-medium leading-relaxed italic">
           "Stability leak detected in 'Volatility' quadrant. Reducing Execution Speed protocol..."
         </p>
      </div>
    </div>
  );
}
