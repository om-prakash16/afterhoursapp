"use client";

import { useState, useEffect } from "react";
import { 
  Waves, 
  ArrowUpRight, 
  ArrowDownRight, 
  Activity, 
  Zap,
  Target,
  BarChart3,
  Globe
} from "lucide-react";

export default function WhaleFlow() {
  const [flows, setFlows] = useState<any[]>([]);

  useEffect(() => {
    const generateFlow = () => {
      const symbols = ["BTC", "ETH", "SOL", "BNB"];
      const sides = ["BUY", "SELL"];
      const exchanges = ["Binance", "Coinbase", "Kraken"];
      
      return {
        id: Math.random().toString(36).substr(2, 9),
        asset: symbols[Math.floor(Math.random() * symbols.length)],
        side: sides[Math.floor(Math.random() * sides.length)],
        amount: (Math.random() * 50 + 10).toFixed(2),
        value: (Math.random() * 2 + 0.5).toFixed(1) + "M",
        exchange: exchanges[Math.floor(Math.random() * exchanges.length)],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      };
    };

    setFlows([generateFlow(), generateFlow(), generateFlow()]);

    const interval = setInterval(() => {
      setFlows(prev => [generateFlow(), ...prev.slice(0, 4)]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-morphism rounded-[3rem] border border-white/10 p-10 space-y-8 bg-black/40 relative overflow-hidden group">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
           <Waves size={24} className="text-indigo-400 animate-pulse" />
           Whale Flow
        </h3>
        <div className="flex items-center gap-2">
           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
           <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Live Orderbook Audit</span>
        </div>
      </div>

      <div className="space-y-4">
        {flows.map((flow) => (
          <div key={flow.id} className="p-5 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between hover:bg-white/10 transition-all group/flow cursor-default">
             <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${flow.side === 'BUY' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                   {flow.side === 'BUY' ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
                </div>
                <div>
                   <div className="text-sm font-black text-white flex items-center gap-2">
                      {flow.asset} {flow.side} 
                      <span className="text-[10px] text-slate-500 font-bold tracking-normal">— {flow.amount} Coins</span>
                   </div>
                   <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                     {flow.exchange} • {flow.time}
                   </div>
                </div>
             </div>
             <div className="text-right">
                <div className="text-lg font-black text-white">${flow.value}</div>
                <div className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Institutional Block</div>
             </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/5">
         <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
            <div className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">Buy Momentum</div>
            <div className="text-sm font-black text-emerald-400">62.4%</div>
         </div>
         <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
            <div className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">Total Flow (24h)</div>
            <div className="text-sm font-black text-white">$4.2B</div>
         </div>
      </div>
    </div>
  );
}
