"use client";

import { useEffect, useState } from "react";

interface ConfidenceMeterProps {
  score: number;
  label: string;
  size?: number;
  strokeWidth?: number;
  color?: "emerald" | "indigo" | "rose" | "amber";
}

export default function ConfidenceMeter({ 
  score, 
  label, 
  size = 120, 
  strokeWidth = 12,
  color = "indigo"
}: ConfidenceMeterProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 300);
    return () => clearTimeout(timer);
  }, [score]);

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  const colorMap = {
    emerald: {
      stroke: "stroke-emerald-500",
      bg: "stroke-emerald-500/20",
      text: "text-emerald-400",
      stop1: "#10b981",
      stop2: "#059669"
    },
    indigo: {
      stroke: "stroke-indigo-500",
      bg: "stroke-indigo-500/20",
      text: "text-indigo-400",
      stop1: "#6366f1",
      stop2: "#4f46e5"
    },
    rose: {
      stroke: "stroke-rose-500",
      bg: "stroke-rose-500/20",
      text: "text-rose-400",
      stop1: "#f43f5e",
      stop2: "#e11d48"
    },
    amber: {
      stroke: "stroke-amber-500",
      bg: "stroke-amber-500/20",
      text: "text-amber-400",
      stop1: "#f59e0b",
      stop2: "#d97706"
    }
  };

  const c = colorMap[color];

  return (
    <div className="flex flex-col items-center justify-center relative group">
      <svg width={size} height={size} className="transform -rotate-90 filter drop-shadow-xl">
        <defs>
          <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={c.stop1} />
            <stop offset="100%" stopColor={c.stop2} />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="transparent"
          className={c.bg}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke={`url(#gradient-${color})`}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className={`text-2xl font-black ${c.text}`}>{animatedScore}%</div>
      </div>
      <div className="mt-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">
        {label}
      </div>
    </div>
  );
}
