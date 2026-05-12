"use client";

import { 
  AlertCircle, 
  Search, 
  Zap, 
  RotateCcw,
  Cpu,
  Inbox
} from "lucide-react";

export function SkeletonCard() {
  return (
    <div className="glass-morphism rounded-[2.5rem] border border-white/10 p-10 space-y-6 animate-pulse">
      <div className="flex justify-between items-start">
        <div className="w-14 h-14 rounded-2xl bg-white/5 shadow-2xl" />
        <div className="w-20 h-6 rounded-lg bg-white/5" />
      </div>
      <div className="space-y-3">
        <div className="w-24 h-3 rounded bg-white/5" />
        <div className="w-40 h-8 rounded bg-white/5" />
      </div>
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/5 animate-pulse">
      <div className="flex items-center gap-6">
        <div className="w-12 h-12 rounded-xl bg-white/5" />
        <div className="space-y-2">
          <div className="w-32 h-4 rounded bg-white/5" />
          <div className="w-48 h-3 rounded bg-white/5" />
        </div>
      </div>
      <div className="w-16 h-8 rounded bg-white/5" />
    </div>
  );
}

export function EmptyState({ 
  icon: Icon = Inbox, 
  title = "No Data Found", 
  message = "Aura is currently monitoring the environment. Check back shortly.",
  actionLabel,
  onAction
}: any) {
  return (
    <div className="glass-morphism rounded-[3rem] border border-white/10 p-20 text-center flex flex-col items-center justify-center space-y-6">
      <div className="w-20 h-20 rounded-full bg-indigo-600/10 flex items-center justify-center text-indigo-500 mb-2 border border-indigo-500/20 shadow-2xl shadow-indigo-500/10">
        <Icon size={40} />
      </div>
      <div className="space-y-2">
        <h3 className="text-2xl font-black text-white uppercase tracking-tight">{title}</h3>
        <p className="text-slate-500 max-w-sm mx-auto font-medium">{message}</p>
      </div>
      {actionLabel && (
        <button 
          onClick={onAction}
          className="px-8 py-4 rounded-2xl bg-indigo-600 text-white font-black text-xs uppercase tracking-widest hover:bg-indigo-500 transition-all active:scale-95 shadow-xl shadow-indigo-600/20"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export function ErrorState({ error, retry }: { error: string, retry?: () => void }) {
  return (
    <div className="glass-morphism rounded-[3rem] border border-rose-500/20 p-20 text-center bg-rose-500/5">
      <div className="w-20 h-20 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 mx-auto mb-6 border border-rose-500/20 shadow-2xl shadow-rose-500/10">
        <AlertCircle size={40} />
      </div>
      <div className="space-y-2">
        <h3 className="text-2xl font-black text-white uppercase tracking-tight">Intelligence Mismatch</h3>
        <p className="text-slate-500 max-w-sm mx-auto font-medium">{error}</p>
      </div>
      {retry && (
        <button 
          onClick={retry}
          className="mt-8 flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-slate-950 font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all mx-auto"
        >
          <RotateCcw size={16} />
          Reconnect Neural Link
        </button>
      )}
    </div>
  );
}
