"use client";

import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  Tooltip
} from "recharts";

interface TradeDNAMetrics {
  risk_tolerance: number;
  aggression: number;
  patience: number;
  discipline: number;
  emotional_control: number;
}

interface TradeDNARadarProps {
  metrics: TradeDNAMetrics;
}

export default function TradeDNARadar({ metrics }: TradeDNARadarProps) {
  const chartData = [
    { subject: "Patience", value: metrics.patience * 100 },
    { subject: "Aggression", value: metrics.aggression * 100 },
    { subject: "Discipline", value: metrics.discipline * 100 },
    { subject: "Risk Tolerance", value: metrics.risk_tolerance * 100 },
    { subject: "Emotional Control", value: metrics.emotional_control * 100 },
  ];

  return (
    <div className="h-full w-full min-h-[350px] relative">
      {/* Background Decor for Chart */}
      <div className="absolute inset-0 flex items-center justify-center -z-10">
        <div className="w-[80%] h-[80%] bg-indigo-500/5 rounded-full blur-[60px] animate-pulse" />
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
          <PolarGrid stroke="#334155" strokeWidth={0.5} />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: "bold" }} 
          />
          <PolarRadiusAxis 
            angle={30} 
            domain={[0, 100]} 
            tick={false} 
            axisLine={false} 
          />
          <Radar
            name="Trade DNA"
            dataKey="value"
            stroke="#6366f1"
            strokeWidth={3}
            fill="#6366f1"
            fillOpacity={0.25}
            animationBegin={300}
            animationDuration={1500}
            animationEasing="ease-out"
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: "#0f172a", 
              borderColor: "rgba(255,255,255,0.1)",
              borderRadius: "16px",
              color: "#fff",
              backdropFilter: "blur(10px)",
              boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
            }}
            itemStyle={{ color: "#818cf8" }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
