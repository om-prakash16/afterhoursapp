"use client";

import { useEffect, useState } from "react";
import { 
  Dna, 
  Zap, 
  ShieldAlert, 
  TrendingUp, 
  TrendingDown, 
  RotateCcw, 
  Play,
  Activity,
  Target,
  BarChart3,
  Info
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from "recharts";

export default function SandboxPage() {
  const [params, setParams] = useState({
    asset: "BTC/USDT",
    side: "BUY",
    entry: 65000,
    leverage: 10,
    size: 1000,
    sl: 63000,
    tp: 70000
  });

  const [simulation, setSimulation] = useState<any>(null);

  const runSimulation = () => {
    // Basic local calculation for instant feedback
    const isBuy = params.side === "BUY";
    const liqPrice = isBuy ? params.entry * (1 - (1/params.leverage)) : params.entry * (1 + (1/params.leverage));
    const tpRoi = ((params.tp - params.entry) / params.entry) * params.leverage * 100 * (isBuy ? 1 : -1);
    const slRoi = ((params.sl - params.entry) / params.entry) * params.leverage * 100 * (isBuy ? 1 : -1);

    setSimulation({
      scenarios: [
        { label: "Best Case", roi: tpRoi, pnl: (params.size * tpRoi) / 100, color: "#10b981" },
        { label: "Worst Case", roi: slRoi, pnl: (params.size * slRoi) / 100, color: "#f43f5e" },
        { label: "Liquidation", roi: -100, pnl: -params.size, color: "#1e293b" }
      ],
      liq_price: liqPrice.toFixed(2),
      rr_ratio: Math.abs(tpRoi / slRoi).toFixed(2)
    });
  };

  useEffect(() => { runSimulation(); }, [params]);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 pb-20 pt-28 px-6">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-indigo-400">
              <RotateCcw size={32} className="animate-spin-slow" />
              <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Trade Sandbox</h1>
            </div>
            <p className="text-slate-500 max-w-xl font-medium">
              Stress-test your market hypotheses. Simulate liquidation thresholds and probabilistic ROI before Aura commits your capital.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Controls */}
          <div className="lg:col-span-4 space-y-6">
            <div className="glass-morphism rounded-[2.5rem] border border-white/10 p-8 space-y-8">
              <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                <Target size={18} className="text-indigo-500" />
                Parameters
              </h3>

              <div className="space-y-6">
                <InputGroup label="Entry Price" value={params.entry} onChange={(v: any) => setParams({...params, entry: v})} step={100} />
                <InputGroup label="Leverage" value={params.leverage} onChange={(v: any) => setParams({...params, leverage: v})} min={1} max={100} />
                <InputGroup label="Position Size (USDT)" value={params.size} onChange={(v: any) => setParams({...params, size: v})} step={500} />
                <InputGroup label="Take Profit" value={params.tp} onChange={(v: any) => setParams({...params, tp: v})} step={100} />
                <InputGroup label="Stop Loss" value={params.sl} onChange={(v: any) => setParams({...params, sl: v})} step={100} />
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setParams({...params, side: "BUY"})}
                  className={`flex-1 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${params.side === "BUY" ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20" : "bg-white/5 text-slate-500"}`}
                >
                  Long
                </button>
                <button 
                  onClick={() => setParams({...params, side: "SELL"})}
                  className={`flex-1 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${params.side === "SELL" ? "bg-rose-600 text-white shadow-lg shadow-rose-600/20" : "bg-white/5 text-slate-500"}`}
                >
                  Short
                </button>
              </div>
            </div>
          </div>

          {/* Visualization */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Outcome Gauge */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <OutcomeStat label="Liq. Price" value={`$${simulation?.liq_price}`} sub="Position Failure" icon={ShieldAlert} color="text-rose-500" />
               <OutcomeStat label="Risk/Reward" value={`${simulation?.rr_ratio}:1`} sub="Efficiency Rating" icon={BarChart3} color="text-indigo-400" />
               <OutcomeStat label="Max Gain" value={`+$${simulation?.scenarios[0].pnl.toLocaleString()}`} sub={`${simulation?.scenarios[0].roi.toFixed(1)}% ROI`} icon={TrendingUp} color="text-emerald-400" />
            </div>

            {/* Projection Chart */}
            <div className="glass-morphism rounded-[3rem] border border-white/10 p-10 space-y-8">
               <div className="flex justify-between items-center">
                 <h3 className="text-xl font-black text-white tracking-tight uppercase flex items-center gap-2">
                   <Activity size={24} className="text-indigo-500" />
                   ROI Projection
                 </h3>
                 <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-black text-indigo-400 uppercase tracking-widest">
                   Simulated Outcome
                 </div>
               </div>

               <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={simulation?.scenarios}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                      <XAxis 
                        dataKey="label" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: "#64748b", fontSize: 10, fontWeight: 900 }} 
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: "#64748b", fontSize: 10 }} 
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" }}
                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                      />
                      <Bar dataKey="roi" radius={[8, 8, 0, 0]}>
                        {simulation?.scenarios.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
               </div>

               <div className="p-6 rounded-2xl bg-white/5 border border-white/5 flex items-start gap-4">
                  <Info size={20} className="text-indigo-400 shrink-0" />
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Aura Analytics: This trade has a **{simulation?.rr_ratio}:1** reward-to-risk ratio. The liquidation threshold is **{((Math.abs(params.entry - parseFloat(simulation?.liq_price)) / params.entry) * 100).toFixed(2)}%** away from entry. 
                    {parseFloat(simulation?.rr_ratio) < 2 ? " Aura recommends adjusting your Take Profit for better efficiency." : " This setup matches your Precision Architect DNA."}
                  </p>
               </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

function InputGroup({ label, value, onChange, min = 0, max = 1000000, step = 1 }: any) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</label>
        <div className="text-sm font-bold text-white font-mono">{value}</div>
      </div>
      <input 
        type="range" 
        min={min} 
        max={max} 
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer accent-indigo-600"
      />
    </div>
  );
}

function OutcomeStat({ label, value, sub, icon: Icon, color }: any) {
  return (
    <div className="glass-morphism rounded-[2.5rem] border border-white/10 p-8 space-y-4 hover:border-white/20 transition-all group">
      <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center ${color} group-hover:scale-110 transition-transform`}>
        <Icon size={24} />
      </div>
      <div className="space-y-1">
        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</h4>
        <div className="text-2xl font-black text-white tracking-tight">{value}</div>
        <p className="text-[10px] font-bold text-slate-600 uppercase">{sub}</p>
      </div>
    </div>
  );
}
