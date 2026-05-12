"use client";

import { useState, useEffect } from "react";
import { 
  Zap, 
  Shield, 
  Brain, 
  Lock, 
  TrendingUp, 
  Activity,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";

export default function DemoModeOverlay() {
  const [step, setStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Scripted Timeline
  const script = [
    { title: "Monitoring Global Alpha", sub: "Aura is auditing institutional signal streams...", icon: Activity, color: "text-indigo-400" },
    { title: "Institutional Signal Detected", sub: "Whale Tracker Alpha: BUY BTC/USDT (10x Leverage)", icon: Zap, color: "text-amber-400" },
    { title: "Neural DNA Resync", sub: "Auditing signal against 'Safe Haven Guard' DNA...", icon: Brain, color: "text-indigo-400" },
    { title: "Safety Translation Applied", sub: "Risk Mismatch: Reducing Leverage (10x -> 2x)", icon: Shield, color: "text-emerald-400" },
    { title: "Execution Guard Active", sub: "Ready for your confirmation.", icon: CheckCircle2, color: "text-indigo-400" },
    { title: "Psychological Audit: PANIC", sub: "Aura detected unstable heart rate / rapid clicking.", icon: AlertTriangle, color: "text-rose-500" },
    { title: "ANTI-FOMO LOCK ENGAGED", sub: "Execution blocked for 30 minutes. Capital preserved.", icon: Lock, color: "text-rose-600" },
  ];

  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => {
        setStep(prev => (prev < script.length - 1 ? prev + 1 : prev));
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isVisible, script.length]);

  if (!isVisible) return (
    <button 
      onClick={() => setIsVisible(true)}
      className="fixed bottom-24 right-8 z-[200] px-6 py-3 rounded-full bg-indigo-600 text-white font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-indigo-600/40 hover:scale-105 transition-all border border-white/20"
    >
      Initialize Cinematic Demo
    </button>
  );

  const current = script[step];
  const Icon = current.icon;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" />
      
      <div className="relative glass-morphism rounded-[3rem] border border-white/10 p-12 max-w-xl w-full text-center space-y-10 animate-in zoom-in-95 duration-500">
        
        <button 
          onClick={() => { setIsVisible(false); setStep(0); }}
          className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors"
        >
          Exit Demo
        </button>

        <div className={`w-24 h-24 rounded-3xl bg-white/5 flex items-center justify-center ${current.color} mx-auto shadow-2xl border border-white/5 animate-pulse`}>
          <Icon size={48} />
        </div>

        <div className="space-y-4">
           <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Aura Demo Protocol: Step {step + 1}/7</div>
           <h2 className={`text-3xl font-black tracking-tight uppercase ${current.color}`}>{current.title}</h2>
           <p className="text-slate-400 font-medium text-lg leading-relaxed">{current.sub}</p>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-500 transition-all duration-[4000ms] ease-linear" 
            style={{ width: `${((step + 1) / script.length) * 100}%` }}
          />
        </div>

        <div className="flex justify-center gap-2">
          {script.map((_, i) => (
            <div key={i} className={`w-2 h-2 rounded-full transition-all ${i === step ? "bg-indigo-500 w-8" : "bg-white/10"}`} />
          ))}
        </div>

      </div>
    </div>
  );
}
