"use client";

import { useState, useEffect } from "react";
import { 
  Wind, 
  Clock, 
  ShieldCheck, 
  Lock,
  ArrowRight,
  Heart,
  Cpu
} from "lucide-react";
import { getCooldownStatus } from "@/lib/api";

export default function CooldownOverlay() {
  const [status, setStatus] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const checkCooldown = async () => {
      try {
        const data = await getCooldownStatus();
        if (data.is_on_cooldown) {
          setStatus(data);
          setTimeLeft(data.duration_minutes * 60);
        } else {
          setStatus(null);
        }
      } catch (err) {
        console.error("Cooldown check failed", err);
      }
    };

    checkCooldown();
    const interval = setInterval(checkCooldown, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  if (!status || !status.is_on_cooldown) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-[#020617]/95 backdrop-blur-2xl" />
      
      {/* Animated Zen Pulse */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
         <div className="w-[500px] h-[500px] bg-indigo-500/5 rounded-full animate-ping-slow opacity-50" />
         <div className="absolute w-[300px] h-[300px] bg-indigo-600/10 rounded-full animate-pulse-slow" />
      </div>

      <div className="relative glass-morphism rounded-[3rem] border border-white/10 p-16 max-w-2xl w-full text-center space-y-10 animate-in zoom-in-95 duration-700">
        
        <div className="flex justify-center">
           <div className="w-24 h-24 rounded-full bg-indigo-600/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20 shadow-2xl shadow-indigo-500/10 animate-float">
              <Wind size={48} />
           </div>
        </div>

        <div className="space-y-4">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-2">
              <Cpu size={12} className="animate-spin-slow" /> Smart Cooldown Active
           </div>
           <h2 className="text-4xl font-black text-white tracking-tighter uppercase">{status.reason}</h2>
           <p className="text-slate-400 text-lg leading-relaxed max-w-md mx-auto font-medium">
             "{status.calming_advice}"
           </p>
        </div>

        <div className="grid grid-cols-2 gap-8 py-10 border-y border-white/5">
           <div className="space-y-1">
              <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Resync Remaining</div>
              <div className="text-4xl font-black text-white tabular-nums">{formatTime(timeLeft)}</div>
           </div>
           <div className="space-y-1">
              <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Aura Status</div>
              <div className="text-sm font-black text-indigo-400 uppercase tracking-tight flex items-center justify-center gap-2">
                 <ShieldCheck size={16} />
                 Guarding Capital
              </div>
           </div>
        </div>

        <div className="space-y-6">
           <div className="flex items-center justify-center gap-3 text-rose-400">
              <Lock size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">Execution Terminal Locked</span>
           </div>
           <p className="text-[11px] text-slate-600 font-bold uppercase tracking-[0.2em] italic">
             "The market is a machine that transfers money from the impatient to the patient."
           </p>
        </div>

      </div>
    </div>
  );
}
