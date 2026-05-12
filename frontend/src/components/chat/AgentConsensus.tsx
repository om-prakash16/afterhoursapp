"use client";

import { useState, useEffect } from "react";
import { 
  ShieldCheck, 
  Brain, 
  Globe, 
  Target, 
  Zap, 
  Activity, 
  Cpu,
  CheckCircle2,
  AlertTriangle,
  ArrowRight
} from "lucide-react";
import { getAgentConsensus } from "@/lib/api";

export default function AgentConsensus({ tradeParams }: { tradeParams: any }) {
  const [consensus, setConsensus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeAgent, setActiveAgent] = useState(0);

  useEffect(() => {
    const fetchConsensus = async () => {
      try {
        const data = await getAgentConsensus(tradeParams);
        setConsensus(data);
      } catch (err) {
        console.error("Agent consensus failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchConsensus();
  }, [tradeParams]);

  useEffect(() => {
    if (loading || !consensus) return;
    const interval = setInterval(() => {
      setActiveAgent((prev) => (prev + 1) % consensus.agent_reports.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [loading, consensus]);

  if (loading || !consensus) return (
    <div className="p-8 glass-morphism rounded-[2.5rem] border border-white/5 bg-black/40 flex flex-col items-center justify-center space-y-4">
       <div className="w-8 h-8 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
       <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Orchestrating Agent Swarm...</div>
    </div>
  );

  return (
    <div className="glass-morphism rounded-[3rem] border border-indigo-500/20 p-10 space-y-10 bg-indigo-600/[0.03] relative overflow-hidden group">
      
      {/* Background Grid/Particles */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
         <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent" />
      </div>

      <div className="flex justify-between items-center relative z-10">
        <div className="flex items-center gap-3">
           <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-500/20">
              <Cpu size={24} className="animate-spin-slow" />
           </div>
           <div>
              <h3 className="text-xl font-black text-white uppercase tracking-tight">Nexus Swarm Consensus</h3>
              <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Multi-Agent Intelligence Active</div>
           </div>
        </div>
        <div className="text-right">
           <div className="text-3xl font-black text-white tracking-tighter">{consensus.total_confidence}%</div>
           <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Collective Confidence</div>
        </div>
      </div>

      {/* Agents Row */}
      <div className="grid grid-cols-5 gap-4 relative z-10">
         {consensus.agent_reports.map((report: any, i: number) => (
           <AgentIcon 
             key={i} 
             name={report.name} 
             icon={getIcon(report.agent_id)} 
             isActive={i === activeAgent} 
             status={report.status}
           />
         ))}
      </div>

      {/* Active Agent Report */}
      <div className="p-8 rounded-[2rem] bg-black/40 border border-white/5 relative overflow-hidden min-h-[160px] animate-in fade-in slide-in-from-bottom-2 duration-500">
         <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
               <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{consensus.agent_reports[activeAgent].name} Analysis</span>
               <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase ${consensus.agent_reports[activeAgent].status === 'SECURE' || consensus.agent_reports[activeAgent].status === 'ZEN' || consensus.agent_reports[activeAgent].status === 'OPTIMIZED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-indigo-500/20 text-indigo-400'}`}>
                  {consensus.agent_reports[activeAgent].status}
               </span>
            </div>
            <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest">CONF: {consensus.agent_reports[activeAgent].confidence}%</div>
         </div>
         <p className="text-sm text-slate-300 leading-relaxed font-medium">
            "{consensus.agent_reports[activeAgent].recommendation}"
         </p>
      </div>

      {/* Final Decision */}
      <div className="pt-6 border-t border-white/10 space-y-6 relative z-10">
         <div className="flex items-center gap-2 text-[10px] font-black text-indigo-400 uppercase tracking-widest">
            <CheckCircle2 size={12} /> Institutional Consensus Achieved
         </div>
         <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
            <h4 className="text-lg font-black text-white uppercase tracking-tight mb-2">{consensus.final_decision}</h4>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
               {consensus.summary}
            </p>
         </div>
         <button className="w-full py-5 rounded-2xl bg-indigo-600 text-white font-black text-xs uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-3 group">
            Proceed with Execution <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
         </button>
      </div>

    </div>
  );
}

function AgentIcon({ name, icon: Icon, isActive, status }: any) {
  return (
    <div className={`flex flex-col items-center gap-2 transition-all duration-500 ${isActive ? 'scale-110 opacity-100' : 'opacity-40 scale-95'}`}>
       <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${isActive ? 'bg-indigo-600 text-white border-white/20 shadow-lg shadow-indigo-600/20' : 'bg-white/5 text-slate-500 border-white/5'}`}>
          <Icon size={24} />
       </div>
       <div className="text-[8px] font-black text-center uppercase tracking-tighter leading-tight max-w-[50px]">
          {name}
       </div>
    </div>
  );
}

function getIcon(id: string) {
  switch (id) {
    case 'risk_audit': return ShieldCheck;
    case 'emotion_sensor': return Brain;
    case 'sentiment_scanner': return Globe;
    case 'sizing_engine': return Target;
    case 'translator': return Zap;
    default: return Activity;
  }
}
