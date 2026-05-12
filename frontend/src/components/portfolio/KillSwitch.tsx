"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Skull, 
  Power, 
  Lock, 
  ShieldAlert, 
  X, 
  ArrowRight,
  Flame,
  Zap,
  Activity
} from "lucide-react";
import { initiateKillSwitch } from "@/lib/api";

export default function KillSwitch() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSlideComplete, setIsSlideComplete] = useState(false);
  const [isKilling, setIsKilling] = useState(false);
  const [result, setResult] = useState<any>(null);
  
  const [slidePos, setSlidePos] = useState(0);
  const slideRef = useRef<HTMLDivElement>(null);

  const handleSlide = (e: any) => {
    if (!slideRef.current || isSlideComplete) return;
    const rect = slideRef.current.getBoundingClientRect();
    const x = (e.type === 'touchmove' ? e.touches[0].clientX : e.clientX) - rect.left;
    const max = rect.width - 64; // Button width
    const pos = Math.max(0, Math.min(max, x));
    setSlidePos(pos);

    if (pos >= max * 0.95) {
      setIsSlideComplete(true);
      setSlidePos(max);
      handleKill();
    }
  };

  const handleKill = async () => {
    setIsKilling(true);
    try {
      const data = await initiateKillSwitch();
      setResult(data);
    } catch (err) {
      console.error("Kill switch failed", err);
    } finally {
      setIsKilling(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="px-6 py-3 rounded-xl bg-rose-600/10 border border-rose-500/20 text-rose-500 font-black text-[10px] uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all flex items-center gap-2"
      >
        <Power size={14} /> Emergency Kill Switch
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-3xl" />
          
          <div className="relative glass-morphism rounded-[3rem] border border-rose-500/30 w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-500">
            
            <div className="p-10 text-center space-y-8">
               <div className="flex justify-center">
                  <div className={`w-24 h-24 rounded-full flex items-center justify-center border-2 transition-all duration-1000 ${isKilling ? 'bg-rose-600 border-white animate-ping' : 'bg-rose-500/10 border-rose-500/30'}`}>
                     {isKilling ? <Flame size={48} className="text-white" /> : <Skull size={48} className="text-rose-500" />}
                  </div>
               </div>

               <div className="space-y-4">
                  <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Nexus Protocol</h2>
                  <p className="text-slate-400 text-sm leading-relaxed max-w-sm mx-auto font-medium">
                    This will <span className="text-rose-400 font-bold uppercase">instantly liquidate</span> all open positions and move all capital to a cold storage state. This action is irreversible for 24 hours.
                  </p>
               </div>

               {!result ? (
                 <div className="space-y-8 pt-6">
                    <div 
                      ref={slideRef}
                      className="relative w-full h-16 bg-white/5 rounded-2xl border border-white/10 overflow-hidden touch-none"
                      onMouseMove={(e) => e.buttons === 1 && handleSlide(e)}
                      onTouchMove={handleSlide}
                      onMouseUp={() => !isSlideComplete && setSlidePos(0)}
                      onTouchEnd={() => !isSlideComplete && setSlidePos(0)}
                    >
                       <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-rose-500/40 uppercase tracking-widest pointer-events-none">
                          Slide to Liquidate Everything
                       </div>
                       <div 
                         className="absolute left-1 top-1 h-14 w-14 bg-rose-600 rounded-xl flex items-center justify-center text-white shadow-xl cursor-grab active:cursor-grabbing transition-all duration-75"
                         style={{ transform: `translateX(${slidePos}px)` }}
                       >
                          <ArrowRight size={24} />
                       </div>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] hover:text-white transition-colors">
                       Abort Mission
                    </button>
                 </div>
               ) : (
                 <div className="space-y-8 pt-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium leading-relaxed">
                       {result.message}
                    </div>
                    <button 
                      onClick={() => window.location.href = '/dashboard'}
                      className="w-full py-5 rounded-2xl bg-white text-black font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center justify-center gap-3"
                    >
                       Acknowledge Lock <Lock size={16} />
                    </button>
                 </div>
               )}
            </div>

            {/* Red Alert Pulse Background */}
            <div className="absolute inset-0 bg-rose-600/5 -z-10 animate-pulse" />
          </div>
        </div>
      )}
    </>
  );
}
