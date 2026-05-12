"use client";

import { Bell, X, Zap, ShieldAlert, Wallet, Info, CheckCircle2, Brain, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { getNotifications } from "@/lib/api";

export default function NotificationSidebar({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen) {
      getNotifications().then(setNotifications).catch(console.error);
    }
  }, [isOpen]);

  const getIcon = (type: string) => {
    switch (type) {
      case "SIGNAL": return <Zap className="text-amber-400" size={16} />;
      case "RISK": return <ShieldAlert className="text-rose-400" size={16} />;
      case "PORTFOLIO": return <Wallet className="text-indigo-400" size={16} />;
      case "EMOTION": return <Brain className="text-rose-400" size={16} />;
      case "SOCIAL": return <Trophy className="text-amber-400" size={16} />;
      default: return <Info className="text-slate-400" size={16} />;
    }
  };

  return (
    <div className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-[#020617]/95 backdrop-blur-2xl border-l border-white/10 z-[100] transition-transform duration-500 transform ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
      <div className="p-8 flex flex-col h-full">
        
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Bell size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Intelligence Brief</h3>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Real-time Platform Feed</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/5 text-slate-500 hover:text-white transition-all">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-6 no-scrollbar pr-2">
          {notifications.length > 0 ? (
            notifications
              .sort((a, b) => {
                const weight = { HIGH: 3, MEDIUM: 2, LOW: 1 };
                return (weight[b.severity as keyof typeof weight] || 0) - (weight[a.severity as keyof typeof weight] || 0);
              })
              .map((n) => (
              <div 
                key={n.id} 
                className={`p-5 rounded-[1.5rem] border transition-all group relative overflow-hidden ${
                  n.severity === 'HIGH' 
                    ? 'bg-rose-500/10 border-rose-500/30 shadow-[0_0_30px_rgba(244,63,94,0.1)]' 
                    : 'bg-white/5 border-white/5 hover:border-white/10'
                }`}
              >
                <div className="flex gap-4">
                  <div className="shrink-0 mt-1">
                    {getIcon(n.type)}
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                         <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">{n.type} ALERT</span>
                         {n.severity === 'HIGH' && (
                           <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 uppercase tracking-widest animate-pulse">Critical</span>
                         )}
                      </div>
                      <span className="text-[9px] font-bold text-slate-600 uppercase">2m ago</span>
                    </div>
                    <h4 className={`text-sm font-bold transition-colors ${n.severity === 'HIGH' ? 'text-rose-100' : 'text-white group-hover:text-indigo-400'}`}>
                      {n.title}
                    </h4>
                    <p className={`text-xs leading-relaxed ${n.severity === 'HIGH' ? 'text-rose-200/70 font-medium' : 'text-slate-400'}`}>
                      {n.message}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center text-slate-800">
                <CheckCircle2 size={32} />
              </div>
              <p className="text-sm text-slate-500 font-medium">System is optimal. No active alerts.</p>
            </div>
          )}
        </div>

        <div className="pt-6 border-t border-white/5">
          <button className="w-full py-4 rounded-xl bg-indigo-600 text-white font-black text-xs uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20">
            Clear All Notifications
          </button>
        </div>

      </div>
    </div>
  );
}
