"use client";

import { useEffect, useState } from "react";
import { 
  Activity, 
  Zap, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Globe, 
  Search,
  Cpu,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Radar
} from "lucide-react";
import { getMarketSentiment } from "@/lib/api";
import { SkeletonCard, EmptyState } from "@/components/ui/States";

export default function SentimentScannerPage() {
  const [sentiment, setSentiment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSentiment = async () => {
      try {
        const data = await getMarketSentiment();
        setSentiment(data);
      } catch (err) {
        console.error("Sentiment fetch error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSentiment();
    const interval = setInterval(fetchSentiment, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 pb-20 pt-28 px-6 relative overflow-hidden">
      {/* Background Pulse */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/10 blur-[180px] rounded-full -z-10 animate-pulse-slow" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-emerald-600/10 blur-[180px] rounded-full -z-10 animate-pulse-slow" />

      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-2">
              <Radar size={12} className="animate-spin-slow" /> Global Mood Scanner
            </div>
            <div className="flex items-center gap-3 text-indigo-400">
              <Activity size={32} />
              <h1 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">Market Pulse</h1>
            </div>
            <p className="text-slate-500 max-w-xl font-medium">
              Aura aggregates volatility, social bias, and institutional flows to visualize the global market mood.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Main Gauge */}
            <div className="lg:col-span-7">
               <div className="glass-morphism rounded-[3rem] border border-white/10 p-12 space-y-10 bg-black/40 relative overflow-hidden group">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                       <BarChart3 size={24} className="text-indigo-500" />
                       Fear & Greed Index
                    </h3>
                    <div className="px-4 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                       Realtime Sync
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center py-10 relative">
                     <div className="text-8xl font-black text-white tracking-tighter mb-2 group-hover:scale-110 transition-transform duration-700">
                        {sentiment.score}
                     </div>
                     <div className={`text-2xl font-black uppercase tracking-widest ${sentiment.score > 50 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {sentiment.status}
                     </div>
                     
                     {/* Gauge Visual */}
                     <div className="absolute inset-0 flex items-center justify-center -z-10 opacity-20">
                        <div className="w-80 h-80 rounded-full border-[30px] border-white/5 relative">
                           <div 
                             className="absolute inset-[-30px] border-[30px] border-indigo-500 rounded-full shadow-[0_0_50px_rgba(99,102,241,0.5)]"
                             style={{ clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 100%)`, transform: `rotate(${(sentiment.score / 100) * 180}deg)` }}
                           />
                        </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-3 gap-8 pt-10 border-t border-white/5">
                     <SentimentMetric label="Dominant Bias" value={sentiment.dominant_bias} color={sentiment.dominant_bias === 'BULLISH' ? 'text-indigo-400' : 'text-rose-400'} />
                     <SentimentMetric label="Volatility" value={sentiment.volatility_index} color="text-white" />
                     <SentimentMetric label="Trend Strength" value={`${sentiment.trend_strength}%`} color="text-white" />
                  </div>
               </div>
            </div>

            {/* Side Assets */}
            <div className="lg:col-span-5 space-y-6">
               <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest ml-4">Asset-Specific Mood</h3>
               <div className="grid grid-cols-1 gap-4">
                  {sentiment.assets.map((asset: any, i: number) => (
                    <div key={i} className="glass-morphism rounded-3xl border border-white/10 p-6 flex items-center justify-between hover:border-white/20 transition-all group/asset">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center font-black text-indigo-400">
                             {asset.symbol}
                          </div>
                          <div>
                             <div className="text-lg font-black text-white">{asset.symbol} Protocol</div>
                             <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{asset.sentiment}</div>
                          </div>
                       </div>
                       <div className="text-right">
                          <div className={`text-sm font-black flex items-center gap-1 justify-end ${asset.momentum > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                             {asset.momentum > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                             {Math.abs(asset.momentum).toFixed(2)}
                          </div>
                          <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Momentum</div>
                       </div>
                    </div>
                  ))}
               </div>

               <div className="glass-morphism rounded-3xl border border-white/10 p-6 bg-indigo-600/5 group/aura cursor-default">
                  <div className="flex items-center gap-3 mb-3">
                     <Cpu size={16} className="text-indigo-400" />
                     <span className="text-[10px] font-black text-white uppercase tracking-widest">Aura Intelligence Pulse</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed italic">
                    "Market bias is currently <span className="text-indigo-400 font-bold">{sentiment.dominant_bias}</span>. Institutional flows are stabilizing near key liquidity zones. Monitor for high-confidence translations in the Signal Center."
                  </p>
               </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

function SentimentMetric({ label, value, color }: any) {
  return (
    <div className="text-center space-y-1">
      <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{label}</div>
      <div className={`text-sm font-black tracking-tighter uppercase ${color}`}>{value}</div>
    </div>
  );
}
