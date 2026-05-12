"use client";

import { Dna, Info, Target, Zap, Clock, LineChart } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  Radar, RadarChart, PolarGrid, 
  PolarAngleAxis, ResponsiveContainer 
} from "recharts";
import { motion } from "framer-motion";

interface TradeDNAProps {
  dna: {
    risk_tolerance: number;
    aggression: number;
    patience: number;
    technical_bias: number;
    archetype: string;
  };
}

export default function TradeDNACard({ dna }: TradeDNAProps) {
  const chartData = [
    { subject: "Risk", A: dna.risk_tolerance * 100, fullMark: 100 },
    { subject: "Aggression", A: dna.aggression * 100, fullMark: 100 },
    { subject: "Patience", A: dna.patience * 100, fullMark: 100 },
    { subject: "Technical", A: dna.technical_bias * 100, fullMark: 100 },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden group"
    >
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full -mr-16 -mt-16 transition-all group-hover:bg-indigo-500/10" />
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <Dna size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 leading-tight">Your Trade DNA</h3>
            <p className="text-sm text-slate-500 font-medium">{dna.archetype}</p>
          </div>
        </div>
        <button className="p-2 rounded-xl hover:bg-slate-50 text-slate-400 transition-colors">
          <Info size={20} />
        </button>
      </div>

      {/* Radar Chart */}
      <div className="h-64 w-full -ml-4">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
            <PolarGrid stroke="#f1f5f9" />
            <PolarAngleAxis 
              dataKey="subject" 
              tick={{ fill: "#64748b", fontSize: 11, fontWeight: 700 }} 
            />
            <Radar
              name="DNA"
              dataKey="A"
              stroke="#4f46e5"
              strokeWidth={3}
              fill="#4f46e5"
              fillOpacity={0.15}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        {[
          { label: "Risk", value: dna.risk_tolerance, color: "text-rose-500" },
          { label: "Aggro", value: dna.aggression, color: "text-amber-500" },
          { label: "Wait", value: dna.patience, color: "text-emerald-500" },
          { label: "Tech", value: dna.technical_bias, color: "text-indigo-500" },
        ].map((trait, i) => (
          <div key={i} className="p-3 rounded-2xl bg-slate-50/50 border border-slate-100/50">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{trait.label}</p>
            <p className={cn("text-lg font-black", trait.color)}>{Math.round(trait.value * 100)}%</p>
          </div>
        ))}
      </div>

      {/* Expanded Insights */}
      <div className="mt-6 space-y-3">
        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-indigo-500" />
            <span className="text-xs font-bold text-slate-600">Sector Strength</span>
          </div>
          <span className="text-xs font-black text-indigo-600 uppercase">Crypto & AI Tech</span>
        </div>
        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-bold text-slate-600">Entry Timing</span>
          </div>
          <span className="text-xs font-black text-emerald-600 uppercase">Excellent (Top 5%)</span>
        </div>
        <div className="flex items-center justify-between p-3 rounded-2xl bg-rose-50 border border-rose-100">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-rose-500" />
            <span className="text-xs font-bold text-rose-600 italic">Core Weakness</span>
          </div>
          <span className="text-xs font-black text-rose-600 uppercase">Exiting Too Early</span>
        </div>
      </div>

      <div className="mt-8 pt-8 border-t border-slate-50">
        <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100/50">
          <p className="text-xs leading-relaxed text-indigo-700 font-medium italic">
            "Your high patience combined with a technical bias suggests you're a Strategist. You wait for high-probability setups rather than chasing volatility."
          </p>
        </div>
      </div>
    </motion.div>
  );
}
