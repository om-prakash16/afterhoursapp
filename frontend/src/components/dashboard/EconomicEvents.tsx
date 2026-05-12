"use client";

import { useEffect, useState } from "react";
import { 
  Calendar, 
  AlertTriangle, 
  Zap, 
  TrendingUp, 
  Clock,
  ArrowRight,
  ShieldAlert,
  Cpu
} from "lucide-react";
import { getEconomicEvents } from "@/lib/api";

export default function EconomicEvents() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEconomicEvents();
        setEvents(data);
      } catch (err) {
        console.error("Events fetch error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading) return null;

  return (
    <div className="glass-morphism rounded-[3rem] border border-white/10 p-10 space-y-8 bg-black/40 relative overflow-hidden group">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
           <Calendar size={24} className="text-indigo-500" />
           Macro Events
        </h3>
        <div className="px-3 py-1 rounded-lg bg-white/5 border border-white/5 text-[9px] font-black text-slate-500 uppercase tracking-widest">
           Next 72h
        </div>
      </div>

      <div className="space-y-6">
        {events.map((event) => (
          <div key={event.id} className="relative pl-8 border-l border-white/10 space-y-3 group/event">
             {/* Timeline Node */}
             <div className="absolute left-[-5px] top-0 w-[9px] h-[9px] rounded-full bg-slate-800 border-2 border-white/20 group-hover/event:bg-indigo-500 group-hover/event:border-indigo-400 transition-all" />
             
             <div className="flex justify-between items-start">
                <div>
                   <div className="text-xs font-black text-white group-hover/event:text-indigo-400 transition-colors uppercase tracking-tight">{event.name}</div>
                   <div className="flex items-center gap-2 mt-1">
                      <Clock size={10} className="text-slate-500" />
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {event.category}
                      </span>
                   </div>
                </div>
                <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                  event.impact === 'CRITICAL' ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' : 
                  (event.impact === 'HIGH' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20')
                }`}>
                   {event.impact}
                </div>
             </div>

             <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                <div className="flex items-center gap-2 text-indigo-400">
                   <ShieldAlert size={12} />
                   <span className="text-[9px] font-black uppercase tracking-widest">Sensitivity Audit</span>
                </div>
                <div className="text-[10px] text-slate-400 font-medium leading-relaxed">
                  {event.sensitivity}. Aura predicts: <span className="text-white font-bold">{event.prediction}</span>
                </div>
             </div>
          </div>
        ))}
      </div>

      <div className="p-4 rounded-2xl bg-indigo-600/5 border border-indigo-500/10 flex items-center gap-4 group/aura">
         <Cpu size={16} className="text-indigo-400 animate-pulse" />
         <p className="text-[10px] text-slate-400 font-medium leading-relaxed italic">
           "The macro trend dictates the micro execution. Synchronize your DNA with the Fed cycle."
         </p>
      </div>
    </div>
  );
}
