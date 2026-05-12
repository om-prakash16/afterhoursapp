"use client";

import { useEffect, useState } from "react";
import { 
  Zap, 
  TrendingUp, 
  TrendingDown, 
  Shield, 
  ArrowRight, 
  Info,
  Clock,
  CheckCircle2,
  AlertCircle,
  Cpu,
  BarChart3,
  Target,
  Wallet,
  Brain,
  Lock,
  ArrowUpRight,
  ArrowDownRight,
  Users
} from "lucide-react";
import { getPersonalizedSignals } from "@/lib/api";
import MarketSummary from "@/components/dashboard/MarketSummary";
import { SkeletonCard, EmptyState, ErrorState } from "@/components/ui/States";
import SimulationModal from "@/components/signals/SimulationModal";
import AgentConsensus from "@/components/chat/AgentConsensus";

export default function SignalsPage() {
  const [signals, setSignals] = useState<any[]>([]);
  const [fomoGuard, setFomoGuard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSignal, setSelectedSignal] = useState<any>(null);
  const [isSimOpen, setIsSimOpen] = useState(false);
  const [executionStep, setExecutionStep] = useState<'IDLE' | 'CONSENSUS' | 'SIMULATION'>('IDLE');

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPersonalizedSignals();
      setSignals(data);
      setFomoGuard({ is_blocked: true, reason: "Emotional Instability", cooldown: 24 });
    } catch (error) {
      setError("Failed to synchronize with the institutional data stream.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleExecute = (signal: any) => {
    setSelectedSignal(signal);
    setExecutionStep('CONSENSUS');
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 pb-20 pt-28 px-6">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-2">
              <Zap size={12} /> Neural Grid Active
            </div>
            <div className="flex items-center gap-3 text-indigo-400">
              <Cpu size={32} />
              <h1 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">Intelligence Center</h1>
            </div>
            <p className="text-slate-500 max-w-xl font-medium italic">
              "Institutional Alpha, Translated for Your DNA."
            </p>
          </div>
        </div>

        <MarketSummary />

        <div className="grid grid-cols-1 gap-12">
          {loading ? (
            <div className="grid grid-cols-1 gap-12">
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : error ? (
            <ErrorState error={error} retry={fetchData} />
          ) : signals.length > 0 ? (
            signals.map((signal, idx) => (
              <SignalCard 
                key={idx} 
                signal={signal} 
                onExecute={() => handleExecute(signal)}
              />
            ))
          ) : (
            <EmptyState 
              icon={Zap} 
              title="Intelligence Dry" 
              message="No high-confidence signals match your current Trade DNA parameters. Aura is monitoring the Macro Trend for a precision entry." 
            />
          )}
        </div>
      </div>

      {/* Execution Flow: Multi-Agent Consensus */}
      {executionStep === 'CONSENSUS' && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-6">
           <div className="absolute inset-0 bg-black/80 backdrop-blur-2xl" onClick={() => setExecutionStep('IDLE')} />
           <div className="relative w-full max-w-4xl animate-in zoom-in-95 duration-500">
              <AgentConsensus 
                tradeParams={selectedSignal} 
                onProceed={() => setExecutionStep('SIMULATION')} 
              />
           </div>
        </div>
      )}

      {/* Execution Flow: Safe Simulation */}
      <SimulationModal 
        isOpen={executionStep === 'SIMULATION'} 
        onClose={() => setExecutionStep('IDLE')} 
        signal={selectedSignal}
        onConfirm={() => {
           alert("Institutional Trade Executed via Nexus Protocol.");
           setExecutionStep('IDLE');
        }}
      />

      {fomoGuard?.is_blocked && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 pointer-events-none">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md pointer-events-auto" />
          <div className="relative glass-morphism rounded-[3rem] border border-rose-500/30 p-12 max-w-lg w-full text-center space-y-8 animate-in zoom-in-95 duration-500 pointer-events-auto shadow-[0_0_50px_rgba(244,63,94,0.2)]">
            <div className="w-20 h-20 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 mx-auto border border-rose-500/20 shadow-2xl">
              <Lock size={40} />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-white uppercase tracking-tight">Psychological Block</h2>
              <p className="text-slate-400 font-medium">
                Aura has detected <span className="text-rose-400 font-bold uppercase">{fomoGuard.reason}</span>. To protect your Guarded Capital, trade execution is temporarily disabled.
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Cooldown Remaining</div>
              <div className="text-4xl font-black text-white">{fomoGuard.cooldown} <span className="text-sm text-rose-500 uppercase tracking-widest">Minutes</span></div>
            </div>
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest italic">
              "Capital preservation is the ultimate victory." — Aura
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function SignalCard({ signal, onExecute }: { signal: any, onExecute: () => void }) {
  return (
    <div className="glass-morphism rounded-[3rem] border border-white/10 overflow-hidden hover:border-white/20 transition-all group/card">
      <div className="grid grid-cols-1 lg:grid-cols-12">
        <div className="lg:col-span-4 p-10 bg-white/[0.02] border-r border-white/10 space-y-10">
          <div className="flex items-center justify-between">
             <div className="space-y-1">
               <h3 className="text-3xl font-black text-white tracking-tighter">{signal.asset}</h3>
               <div className={`text-[10px] font-black px-3 py-1 rounded-full inline-block ${signal.side === 'BUY' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                 INSTITUTIONAL {signal.side}
               </div>
             </div>
             <div className="text-right">
               <div className="text-2xl font-black text-white">{signal.confidence}%</div>
               <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Confidence</div>
             </div>
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Leader Entry</span>
              <div className="font-mono font-bold">
                <LivePrice entry={signal.original_entry} />
              </div>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Aggressive SL</span>
              <span className="text-white font-mono font-bold">${signal.original_sl.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Leverage</span>
              <span className="text-white font-mono font-bold">{signal.original_leverage}x</span>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex items-center gap-4">
             <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center">
                <Users size={16} />
             </div>
             <div>
                <div className="text-xs font-bold text-white">Whale Tracker Alpha</div>
                <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Verified Provider</div>
             </div>
          </div>
        </div>

        <div className="lg:col-span-8 p-10 space-y-10 bg-indigo-600/[0.02]">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                  <Brain size={20} />
                </div>
                <h3 className="text-xl font-black text-white uppercase tracking-tight">Smart DNA Translation</h3>
              </div>
              <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-3 py-1 rounded-lg border border-indigo-500/20 animate-pulse">
                Optimization Complete
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <TranslationCard label="Adjusted Size" value={signal.adjusted_size} icon={Shield} />
              <TranslationCard label="Personalized SL" value={`$${signal.adjusted_sl.toLocaleString()}`} icon={Target} sub="DNA Multiplier: 1.2x" />
              <TranslationCard label="Safe Leverage" value={`${signal.adjusted_leverage}x`} icon={Zap} sub="Risk Score: 18/100" />
           </div>

           <div className="space-y-6">
              <div className="glass-morphism rounded-[2rem] border border-white/5 p-8 relative overflow-hidden group/tip cursor-default">
                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover/tip:opacity-20 transition-opacity">
                  <Brain size={40} />
                </div>
                <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Aura Intelligence</div>
                <p className="text-sm text-slate-400 leading-relaxed italic">
                  "{signal.personal_advice}"
                </p>
              </div>

              <button 
                onClick={onExecute}
                className="w-full py-5 rounded-2xl bg-indigo-600 text-white font-black text-xs uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 active:scale-95 flex items-center justify-center gap-3"
              >
                <Zap size={18} />
                Execute Translation
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}

function TranslationCard({ label, value, icon: Icon, sub }: any) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-slate-500">
        <Icon size={14} />
        <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
      </div>
      <div className="text-2xl font-black text-white tracking-tight">{value}</div>
      {sub && <div className="text-[9px] font-bold text-indigo-400/60 uppercase tracking-widest">{sub}</div>}
    </div>
  );
}

function LivePrice({ entry }: { entry: number }) {
  const [price, setPrice] = useState(entry);
  const [flash, setFlash] = useState<"up" | "down" | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const change = (Math.random() - 0.5) * (entry * 0.001);
      setPrice(prev => {
        const next = prev + change;
        setFlash(next > prev ? "up" : "down");
        setTimeout(() => setFlash(null), 800);
        return next;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [entry]);

  return (
    <div className={`transition-colors duration-700 ${
      flash === "up" ? "text-emerald-400" : flash === "down" ? "text-rose-400" : "text-white"
    }`}>
      ${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
    </div>
  );
}
