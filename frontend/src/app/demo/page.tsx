"use client";

import { useEffect, useState } from "react";
import { 
  Cpu, 
  Zap, 
  ShieldCheck, 
  Brain, 
  Target, 
  ArrowRight, 
  BarChart3, 
  CheckCircle2,
  Lock,
  Activity,
  Globe
} from "lucide-react";
import ConfidenceMeter from "@/components/ui/ConfidenceMeter";
import Link from "next/link";

export default function DemoPage() {
  const [step, setStep] = useState(0);

  // Auto-play sequence for Investor Demo
  useEffect(() => {
    const sequence = [
      { step: 1, delay: 3000 }, // Intercept Signal
      { step: 2, delay: 6000 }, // Nexus Swarm Audit
      { step: 3, delay: 10000 }, // Emotional Check
      { step: 4, delay: 14000 }, // Safe Execution Simulation
      { step: 5, delay: 18000 }, // Protection Activated
    ];

    const timers = sequence.map(s => 
      setTimeout(() => setStep(s.step), s.delay)
    );

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 overflow-hidden relative flex flex-col justify-center items-center p-6">
      
      {/* Cinematic Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="absolute top-10 left-10 z-10 flex items-center gap-3">
         <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-[0_0_30px_rgba(79,70,229,0.5)]">
            <Cpu size={24} className="text-white animate-pulse" />
         </div>
         <div>
            <h1 className="text-2xl font-black text-white tracking-tighter uppercase">AfterHours</h1>
            <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Institutional AI Swarm</div>
         </div>
      </div>

      <div className="absolute top-10 right-10 z-10">
         <div className="px-4 py-2 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            Live Demo Sequence
         </div>
      </div>

      {/* Main Presentation Stage */}
      <div className="relative z-10 w-full max-w-5xl transition-all duration-1000">
         
         {/* Step 0: Idle */}
         <div className={`transition-all duration-1000 absolute inset-0 flex flex-col items-center justify-center text-center space-y-6 ${step === 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
            <Globe size={80} className="text-slate-700 animate-spin-slow" />
            <h2 className="text-5xl font-black text-white tracking-tighter uppercase">Awaiting Market Alpha</h2>
            <p className="text-slate-500 font-medium max-w-lg">Scanning global social sentiment and institutional flow for high-probability setups...</p>
         </div>

         {/* Step 1: Signal Intercept */}
         <div className={`transition-all duration-1000 absolute inset-0 flex flex-col items-center justify-center text-center space-y-6 ${step === 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
            <div className="w-24 h-24 rounded-full bg-amber-500/20 flex items-center justify-center animate-bounce">
               <Zap size={40} className="text-amber-400" />
            </div>
            <h2 className="text-5xl font-black text-white tracking-tighter uppercase">Signal Intercepted</h2>
            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 text-left w-full max-w-md">
               <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-black text-white">LONG BTC/USDT</span>
                  <span className="text-sm font-bold text-slate-400">@ $63,450</span>
               </div>
               <div className="flex gap-2">
                  <span className="px-3 py-1 rounded bg-amber-500/20 text-amber-400 text-xs font-black uppercase tracking-widest">50x Leverage</span>
                  <span className="px-3 py-1 rounded bg-rose-500/20 text-rose-400 text-xs font-black uppercase tracking-widest">High Risk</span>
               </div>
            </div>
         </div>

         {/* Step 2: Nexus Swarm Audit */}
         <div className={`transition-all duration-1000 absolute inset-0 flex flex-col items-center justify-center space-y-10 ${step === 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
            <div className="text-center space-y-2">
               <h2 className="text-4xl font-black text-white tracking-tighter uppercase">Nexus Swarm Consensus</h2>
               <p className="text-indigo-400 font-bold uppercase tracking-widest text-xs">5 AI Agents Analyzing Trade</p>
            </div>
            <div className="flex gap-6">
               <AgentNode label="Risk Sentinel" icon={ShieldCheck} status="Active" color="indigo" />
               <AgentNode label="Sentiment Pulse" icon={Activity} status="Active" color="emerald" />
               <AgentNode label="Citadel Sizing" icon={Target} status="Calculating" color="amber" />
               <AgentNode label="Aura Emotion" icon={Brain} status="Pending" color="rose" />
            </div>
         </div>

         {/* Step 3: Emotional Check & Translation */}
         <div className={`transition-all duration-1000 absolute inset-0 flex flex-col items-center justify-center space-y-10 ${step === 3 ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
            <div className="grid grid-cols-2 gap-10 w-full">
               <div className="p-8 rounded-[3rem] bg-rose-600/5 border border-rose-500/20 text-center space-y-6">
                  <Brain size={48} className="text-rose-400 mx-auto" />
                  <div>
                     <h3 className="text-2xl font-black text-white uppercase">Behavioral Audit</h3>
                     <p className="text-rose-400 font-medium mt-2">Elevated heart rate detected. Recent loss streak: 2.</p>
                  </div>
               </div>
               <div className="p-8 rounded-[3rem] bg-emerald-600/5 border border-emerald-500/20 text-center space-y-6">
                  <ShieldCheck size={48} className="text-emerald-400 mx-auto" />
                  <div>
                     <h3 className="text-2xl font-black text-white uppercase">DNA Translation</h3>
                     <p className="text-emerald-400 font-medium mt-2">Leverage reduced from 50x to 5x. Capital guarded.</p>
                  </div>
               </div>
            </div>
         </div>

         {/* Step 4: Final Safety Execution */}
         <div className={`transition-all duration-1000 absolute inset-0 flex flex-col items-center justify-center space-y-10 ${step >= 4 ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
            <div className="flex items-center gap-12">
               <ConfidenceMeter score={92} label="Institutional Safety" color="emerald" size={200} strokeWidth={16} />
               <div className="space-y-6 w-[400px]">
                  <h2 className="text-4xl font-black text-white tracking-tighter uppercase">Safe to Execute</h2>
                  <div className="space-y-3">
                     <div className="flex items-center gap-3 text-emerald-400 text-sm font-bold">
                        <CheckCircle2 size={18} /> Swarm Consensus Reached
                     </div>
                     <div className="flex items-center gap-3 text-emerald-400 text-sm font-bold">
                        <CheckCircle2 size={18} /> DNA Sizing Applied
                     </div>
                     <div className="flex items-center gap-3 text-emerald-400 text-sm font-bold">
                        <CheckCircle2 size={18} /> Stop-Loss Optimized
                     </div>
                  </div>
                  {step === 5 && (
                    <Link href="/dashboard" className="block w-full py-5 rounded-2xl bg-indigo-600 text-white font-black text-center text-xs uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-[0_0_40px_rgba(79,70,229,0.4)] animate-in slide-in-from-bottom-10">
                       Enter Terminal
                    </Link>
                  )}
               </div>
            </div>
         </div>

      </div>
    </div>
  );
}

function AgentNode({ label, icon: Icon, status, color }: any) {
  const colorMap: any = {
    indigo: "border-indigo-500/30 bg-indigo-500/10 text-indigo-400 shadow-indigo-500/20",
    emerald: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 shadow-emerald-500/20",
    amber: "border-amber-500/30 bg-amber-500/10 text-amber-400 shadow-amber-500/20",
    rose: "border-rose-500/30 bg-rose-500/10 text-rose-400 shadow-rose-500/20",
  };

  const c = colorMap[color];

  return (
    <div className={`p-6 rounded-3xl border ${c} flex flex-col items-center justify-center w-40 h-40 space-y-4 relative overflow-hidden group`}>
       <div className={`absolute inset-0 bg-current opacity-0 group-hover:opacity-5 transition-opacity`} />
       <Icon size={32} className={status === 'Calculating' || status === 'Pending' ? 'animate-pulse' : ''} />
       <div className="text-center">
          <div className="text-xs font-black text-white uppercase tracking-tight leading-tight">{label}</div>
          <div className="text-[8px] font-black uppercase tracking-widest mt-1 opacity-80">{status}</div>
       </div>
    </div>
  );
}
