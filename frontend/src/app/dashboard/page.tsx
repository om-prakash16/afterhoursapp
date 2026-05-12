"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  TrendingUp, 
  Zap, 
  MessageSquare, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight,
  ChevronRight,
  Shield,
  Clock,
  Cpu,
  BarChart3,
  LayoutDashboard,
  Activity,
  Terminal
} from "lucide-react";
import { getMyDNA, getPersonalizedSignals, getPortfolioSummary, getUserRiskScore } from "@/lib/api";
import { SkeletonCard, SkeletonRow, EmptyState } from "@/components/ui/States";
import RiskHeatmap from "@/components/dashboard/RiskHeatmap";
import EconomicEvents from "@/components/dashboard/EconomicEvents";
import WhaleFlow from "@/components/dashboard/WhaleFlow";

export default function DashboardPage() {
  const [dna, setDna] = useState<any>(null);
  const [signals, setSignals] = useState<any[]>([]);
  const [portfolio, setPortfolio] = useState<any>(null);
  const [risk, setRisk] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    const fetchData = async () => {
      try {
        const [dnaData, signalsData, portData, riskData] = await Promise.all([
          getMyDNA().catch(() => null),
          getPersonalizedSignals().catch(() => []),
          getPortfolioSummary().catch(() => null),
          getUserRiskScore().catch(() => null)
        ]);
        setDna(dnaData);
        setSignals(signalsData);
        setPortfolio(portData);
        setRisk(riskData);
      } catch (error) {
        console.error("Dashboard fetch error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // AI Adaptive UI Logic
  const isHighRisk = risk && risk.current_score > 70;
  const adaptiveContainerClass = isHighRisk 
    ? "min-h-screen bg-[#020617] text-slate-200 pb-20 pt-28 px-6 transition-colors duration-1000 border-t-4 border-rose-500 shadow-[inset_0_0_100px_rgba(244,63,94,0.05)]"
    : "min-h-screen bg-[#020617] text-slate-200 pb-20 pt-28 px-6 transition-colors duration-1000";

  return (
    <div className={adaptiveContainerClass}>
      
      {/* Cinematic Grain & Glows */}
      <div className="fixed inset-0 pointer-events-none -z-10 opacity-30 mix-blend-overlay bg-[url('/grain.png')]" />
      <div className="absolute top-[-10%] right-[-5%] w-[60%] h-[60%] bg-indigo-600/20 blur-[180px] rounded-full -z-20 animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[50%] bg-emerald-600/10 blur-[150px] rounded-full -z-20" />

      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 group">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-2">
              <Cpu size={12} className="animate-pulse" /> Platform Active
            </div>
            <h1 className="text-5xl font-black text-white tracking-tighter uppercase leading-none">
              Command <span className="text-indigo-500">Terminal.</span>
            </h1>
            <p className="text-slate-500 text-lg font-medium max-w-xl leading-relaxed">
              Welcome back, <span className="text-white">{user?.full_name}</span>. Your unique **{dna?.archetype || "Analyzing"}** DNA profile is currently guarding **${portfolio?.guarded_capital?.toLocaleString() || "22,500"}** in assets.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/chat" className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-white text-slate-950 font-black text-sm uppercase tracking-widest hover:bg-indigo-50 transition-all active:scale-95 shadow-2xl shadow-white/10 group/btn">
              <MessageSquare size={20} className="group-hover:rotate-12 transition-transform" />
              Aura Interface
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Feed: 8 Columns */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Real-time Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {loading ? (
                <>
                  <SkeletonCard />
                  <SkeletonCard />
                </>
              ) : (
                <>
                  <StatCard 
                    label="Guarded Capital" 
                    value={`$${portfolio?.guarded_capital?.toLocaleString() || "22,500"}`} 
                    trend="+4.2%" 
                    icon={Wallet} 
                    color="text-emerald-400" 
                    href="/portfolio"
                  />
                  <StatCard 
                    label="Mindset Integrity" 
                    value={risk?.status || "Optimal"} 
                    trend="STABLE" 
                    icon={Shield} 
                    color={risk?.status === "CRITICAL" ? "text-rose-400" : "text-indigo-400"} 
                    href="/analytics"
                  />
                </>
              )}
            </div>

            {/* AI Signal Feed Mini */}
            <div className="glass-morphism rounded-[3rem] border border-white/10 p-10 space-y-8 group/feed hover:border-white/20 transition-all">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                  <Zap size={24} className="text-indigo-500" />
                  Neural Signal Pulse
                </h3>
                <Link href="/signals" className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 hover:text-indigo-400 transition-colors">
                  View Intelligence Center <ChevronRight size={14} />
                </Link>
              </div>

              <div className="space-y-4">
                {loading ? (
                  <>
                    <SkeletonRow />
                    <SkeletonRow />
                    <SkeletonRow />
                  </>
                ) : signals.length > 0 ? (
                  signals.slice(0, 3).map((sig: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group/item cursor-pointer">
                      <div className="flex items-center gap-6">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${sig.side === 'BUY' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                          {sig.side === 'BUY' ? <ArrowUpRight size={24} /> : <ArrowDownRight size={24} />}
                        </div>
                        <div>
                          <div className="text-lg font-black text-white">{sig.asset}</div>
                          <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Translated: {sig.adjusted_leverage} Leverage</div>
                        </div>
                      </div>
                      <div className="text-right">
                         <div className="text-sm font-black text-white">{sig.final_confidence}%</div>
                         <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Neural Confidence</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-10 text-center text-slate-500 font-bold uppercase tracking-widest text-[10px]">
                    No Active Intelligence Matches
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Sidebar: 4 Columns */}
          <div className="lg:col-span-4 space-y-8">
            
            <RiskHeatmap />
            
            <EconomicEvents />
            
            <WhaleFlow />

            {/* Market Sentiment Gauge */}
            <div className="glass-morphism rounded-[3rem] border border-white/10 p-10 space-y-8 bg-black/20">
              <div className="flex justify-between items-center">
                <h3 className="text-[11px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                  <Activity size={18} className="text-indigo-500" />
                  Global Sentiment
                </h3>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
              </div>
              
              <div className="relative h-32 flex flex-col items-center justify-center group/gauge">
                <div className="text-5xl font-black text-white mb-0.5 tracking-tighter">68</div>
                <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Extreme Greed</div>
                
                {/* Neon Gauge */}
                <div className="absolute top-0 w-full h-full flex items-end justify-center overflow-hidden">
                  <div className="w-44 h-44 border-[12px] border-white/5 rounded-full relative">
                    <div 
                      className="absolute top-[-12px] left-[-12px] w-44 h-44 border-[12px] border-indigo-500 rounded-full shadow-[0_0_20px_rgba(99,102,241,0.3)]"
                      style={{ clipPath: "polygon(0 0, 100% 0, 100% 50%, 0 50%)", transform: "rotate(45deg)" }}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/5 space-y-4">
                 <SentimentFactor label="Volatility" value="STABLE" color="text-emerald-400" />
                 <SentimentFactor label="Global Bias" value="BULLISH" color="text-indigo-400" />
                 <SentimentFactor label="Flow Control" value="ACTIVE" color="text-amber-400" />
              </div>
            </div>

            {/* Neural Audit Logs */}
            <div className="glass-morphism rounded-[3rem] border border-white/10 p-8 space-y-6 bg-black/40 relative group/logs">
              <div className="flex justify-between items-center">
                <h3 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                  <Terminal size={14} />
                  Aura Process Audit
                </h3>
                <div className="text-[8px] font-bold text-slate-700 uppercase">v4.2.0-STABLE</div>
              </div>
              
              <div className="h-44 overflow-y-auto no-scrollbar space-y-3 font-mono text-[9px] text-emerald-500/60 group-hover:text-emerald-500 transition-colors">
                <LogLine time="19:52:01" text="DNA Matrix Resync: Safe Haven Archetype verified." />
                <LogLine time="19:52:05" text="Auditing Signal #842... Mismatch detected." color="text-amber-500" />
                <LogLine time="19:52:08" text="AUTO-TRANSLATE: Reducing Risk exposure (5x -> 2x)." color="text-indigo-400" />
                <LogLine time="19:52:12" text="Monitoring Portfolio #2214 stability..." />
                <LogLine time="19:52:15" text="Neural Intelligence Brief hydrated to dashboard." color="text-emerald-400" />
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, trend, icon: Icon, color, href }: any) {
  const content = (
    <div className="glass-morphism rounded-[2.5rem] border border-white/10 p-10 space-y-6 hover:border-white/30 hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden bg-white/[0.01]">
      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
        <Icon size={80} />
      </div>
      <div className="flex justify-between items-start">
        <div className={`w-14 h-14 rounded-2xl bg-white/5 border border-white/5 ${color} flex items-center justify-center shadow-2xl transition-transform group-hover:scale-110`}>
          <Icon size={28} />
        </div>
        <div className="px-3 py-1 rounded-lg bg-white/5 text-[10px] font-black text-white uppercase tracking-widest border border-white/5">
          {trend}
        </div>
      </div>
      <div>
        <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{label}</div>
        <div className="text-3xl font-black text-white tracking-tighter">{value}</div>
      </div>
    </div>
  );

  if (href) return <Link href={href}>{content}</Link>;
  return content;
}

function SentimentFactor({ label, value, color }: any) {
  return (
    <div className="flex justify-between items-center text-xs">
      <span className="font-bold text-slate-500 uppercase tracking-widest text-[9px]">{label}</span>
      <span className={`font-black uppercase tracking-tight ${color}`}>{value}</span>
    </div>
  );
}

function LogLine({ time, text, color = "" }: any) {
  return (
    <div className={`flex gap-3 ${color}`}>
       <span className="text-slate-800">[{time}]</span>
       <span className="tracking-tight">{text}</span>
    </div>
  );
}
