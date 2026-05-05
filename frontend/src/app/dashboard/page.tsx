"use client";

import { useEffect, useState } from "react";
import { MessageSquare, Heart, TrendingUp, Sparkles, BrainCircuit } from "lucide-react";
import { cn } from "@/lib/utils";

// Types matching the backend response
interface MoodPoint {
  mood: string;
  timestamp: string;
}

interface TopicCount {
  topic: string;
  count: number;
}

interface AnalyticsData {
  mood_trend: MoodPoint[];
  most_common_topics: TopicCount[];
  engagement_count: number;
}

export default function DashboardPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, we'd fetch from the actual API:
    // fetch('/api/v1/analytics/{user_id}')
    
    // For the hackathon demo, we simulate a fetch with mock data 
    // that matches the backend structure we just built.
    const mockFetch = setTimeout(() => {
      setData({
        engagement_count: 42,
        most_common_topics: [
          { topic: "cricket", count: 8 },
          { topic: "python", count: 5 },
          { topic: "music", count: 3 }
        ],
        mood_trend: [
          { mood: "neutral", timestamp: "2026-05-04T10:00:00Z" },
          { mood: "stressed", timestamp: "2026-05-04T11:00:00Z" },
          { mood: "angry", timestamp: "2026-05-04T11:30:00Z" },
          { mood: "neutral", timestamp: "2026-05-04T12:00:00Z" },
          { mood: "happy", timestamp: "2026-05-04T13:00:00Z" },
          { mood: "excited", timestamp: "2026-05-04T14:00:00Z" },
          { mood: "happy", timestamp: "2026-05-04T15:00:00Z" },
          { mood: "neutral", timestamp: "2026-05-04T16:00:00Z" },
          { mood: "happy", timestamp: "2026-05-04T17:00:00Z" }
        ]
      });
      setLoading(false);
    }, 800);

    return () => clearTimeout(mockFetch);
  }, []);

  const getMoodConfig = (mood: string) => {
    const m = mood?.toLowerCase() || "neutral";
    if (["happy", "excited", "joyful", "glad", "great", "awesome", "wonderful"].includes(m)) {
      return { height: "100%", color: "bg-emerald-400", label: "Positive" };
    }
    if (["stressed", "anxious", "worried", "sad", "angry", "frustrated", "mad"].includes(m)) {
      return { height: "35%", color: "bg-rose-400", label: "Negative" };
    }
    return { height: "65%", color: "bg-indigo-400", label: "Neutral" };
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <Sparkles className="text-indigo-400 animate-spin" size={32} />
          <p className="text-slate-500 font-medium">Analyzing your insights...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        <header>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Your AI Insights</h1>
          <p className="text-slate-500 mt-2">Here is how you and your companion have been interacting.</p>
        </header>

        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-slate-500 font-medium flex items-center gap-2">
                <MessageSquare size={18} />
                Total Chats
              </p>
              <h2 className="text-6xl font-bold text-slate-900 mt-2">{data?.engagement_count}</h2>
            </div>
            <div className="h-16 w-16 bg-indigo-50 rounded-2xl flex items-center justify-center">
              <TrendingUp className="text-indigo-600" size={32} />
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-8 text-white shadow-xl shadow-indigo-200">
            <p className="text-indigo-100 font-medium flex items-center gap-2 mb-4">
              <BrainCircuit size={18} />
              Top Interests
            </p>
            <div className="flex flex-wrap gap-2">
              {data?.most_common_topics.map((item, idx) => (
                <span 
                  key={idx} 
                  className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-xl text-sm font-semibold border border-white/10 shadow-sm"
                >
                  {item.topic} <span className="opacity-60 ml-1">({item.count})</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Simple CSS Chart for Mood Trend */}
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Heart className="text-rose-500" size={20} />
              Recent Mood Trend
            </h3>
            <span className="text-xs font-medium bg-slate-100 text-slate-500 px-3 py-1 rounded-full">Last {data?.mood_trend.length} messages</span>
          </div>
          
          <div className="h-48 flex items-end justify-between gap-2 md:gap-4 px-2">
            {data?.mood_trend.map((point, idx) => {
              const config = getMoodConfig(point.mood);
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-3 group relative">
                  {/* Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-10 bg-slate-800 text-white text-[10px] px-2 py-1 rounded shadow-lg pointer-events-none whitespace-nowrap z-10">
                    {point.mood}
                  </div>
                  {/* Bar */}
                  <div className="w-full relative h-full flex items-end justify-center">
                    <div 
                      className={cn("w-full max-w-[40px] rounded-t-xl transition-all duration-500 group-hover:opacity-80 shadow-sm", config.color)}
                      style={{ height: config.height }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Chart Legend */}
          <div className="flex justify-center gap-6 mt-8 border-t border-slate-50 pt-6">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-400"></div><span className="text-xs text-slate-500 font-medium">Positive</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-indigo-400"></div><span className="text-xs text-slate-500 font-medium">Neutral</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-rose-400"></div><span className="text-xs text-slate-500 font-medium">Negative</span></div>
          </div>
        </div>

      </div>
    </div>
  );
}
