"use client";

import { useEffect, useState } from "react";
import { 
  Users, 
  Zap, 
  Terminal, 
  BarChart3, 
  Settings, 
  ShieldCheck, 
  Search,
  MoreVertical,
  Activity,
  UserCheck,
  UserX,
  AlertCircle
} from "lucide-react";

export default function AdminCMS() {
  const [activeTab, setActiveTab] = useState("users");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock for demo
    setLoading(true);
    setTimeout(() => {
      if (activeTab === "users") {
        setData([
          { id: 1, name: "CryptoKing", email: "king@crypto.com", status: "ACTIVE", joined: "2024-05-01", trades: 124 },
          { id: 2, name: "ZenTrader", email: "zen@mind.com", status: "ACTIVE", joined: "2024-05-03", trades: 82 },
          { id: 3, name: "BullRunner", email: "bull@market.com", status: "FLAGGED", joined: "2024-05-05", trades: 450 },
        ]);
      } else if (activeTab === "signals") {
        setData([
          { id: 1, asset: "BTC/USDT", side: "BUY", provider: "Institutional", confidence: 92, status: "ACTIVE" },
          { id: 2, asset: "ETH/USDT", side: "SELL", provider: "Aura Prime", confidence: 88, status: "EXPIRED" },
        ]);
      } else if (activeTab === "logs") {
        setData([
          { id: 1, type: "RISK_ADJUST", msg: "Widened SL by 20% for ZenTrader due to HIGH volatility.", time: "2m ago" },
          { id: 2, type: "EMOTION_BLOCK", msg: "Blocked trade for CryptoKing (REVENGE_TRADING detected).", time: "15m ago" },
        ]);
      }
      setLoading(false);
    }, 500);
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 flex">
      
      {/* Sidebar */}
      <div className="w-72 border-r border-white/10 bg-[#020617] p-8 flex flex-col gap-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h1 className="text-lg font-black text-white tracking-tighter">NEXUS COMMAND</h1>
            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest leading-none">System Admin</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          <AdminNavItem icon={Users} label="User Management" active={activeTab === "users"} onClick={() => setActiveTab("users")} />
          <AdminNavItem icon={Zap} label="Signal Control" active={activeTab === "signals"} onClick={() => setActiveTab("signals")} />
          <AdminNavItem icon={Terminal} label="AI Logic Logs" active={activeTab === "logs"} onClick={() => setActiveTab("logs")} />
          <AdminNavItem icon={BarChart3} label="System Analytics" active={activeTab === "analytics"} onClick={() => setActiveTab("analytics")} />
          <div className="pt-4 mt-4 border-t border-white/5">
            <AdminNavItem icon={Settings} label="Global Settings" active={activeTab === "settings"} onClick={() => setActiveTab("settings")} />
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Top Header */}
        <header className="h-24 border-b border-white/10 px-10 flex items-center justify-between bg-white/[0.02]">
          <h2 className="text-xl font-black text-white tracking-tight uppercase">
            {activeTab.replace("-", " ")} Overview
          </h2>
          <div className="flex items-center gap-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input 
                type="text" 
                placeholder="Search resources..." 
                className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-indigo-500 transition-all w-64"
              />
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10" />
          </div>
        </header>

        {/* Dynamic Table Section */}
        <main className="flex-1 p-10 overflow-y-auto no-scrollbar">
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
            </div>
          ) : (
            <div className="glass-morphism rounded-[2.5rem] border border-white/10 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5 border-b border-white/5">
                    {activeTab === "users" && (
                      <>
                        <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Trader</th>
                        <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Email</th>
                        <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Status</th>
                        <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Joined</th>
                        <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Actions</th>
                      </>
                    )}
                    {activeTab === "signals" && (
                      <>
                        <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Asset</th>
                        <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Side</th>
                        <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Source</th>
                        <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Confidence</th>
                        <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Control</th>
                      </>
                    )}
                    {activeTab === "logs" && (
                      <>
                        <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Event Type</th>
                        <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Detail</th>
                        <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Timestamp</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {data.map((item) => (
                    <tr key={item.id} className="hover:bg-white/5 transition-all group">
                      {activeTab === "users" && (
                        <>
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-white uppercase">{item.name.charAt(0)}</div>
                              <span className="font-bold text-white">{item.name}</span>
                            </div>
                          </td>
                          <td className="px-8 py-6 text-sm text-slate-500">{item.email}</td>
                          <td className="px-8 py-6">
                            <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                              item.status === "ACTIVE" ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
                            }`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="px-8 py-6 text-sm text-slate-500">{item.joined}</td>
                          <td className="px-8 py-6 text-right">
                            <button className="p-2 rounded-lg hover:bg-white/5 text-slate-500 hover:text-white transition-all"><MoreVertical size={16} /></button>
                          </td>
                        </>
                      )}
                      {activeTab === "signals" && (
                        <>
                          <td className="px-8 py-6 font-bold text-white">{item.asset}</td>
                          <td className="px-8 py-6">
                            <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                              item.side === "BUY" ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
                            }`}>
                              {item.side}
                            </span>
                          </td>
                          <td className="px-8 py-6 text-sm text-slate-500">{item.provider}</td>
                          <td className="px-8 py-6 text-indigo-400 font-black">{item.confidence}%</td>
                          <td className="px-8 py-6 text-right">
                            <button className="text-[10px] font-black text-rose-500 uppercase tracking-widest hover:text-rose-400">Invalidate</button>
                          </td>
                        </>
                      )}
                      {activeTab === "logs" && (
                        <>
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-2">
                              <AlertCircle size={14} className={item.type.includes("BLOCK") ? "text-rose-500" : "text-amber-500"} />
                              <span className="text-xs font-black text-white">{item.type}</span>
                            </div>
                          </td>
                          <td className="px-8 py-6 text-xs text-slate-400">{item.msg}</td>
                          <td className="px-8 py-6 text-right text-xs text-slate-600 font-mono">{item.time}</td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function AdminNavItem({ icon: Icon, label, active, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
        active 
          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" 
          : "text-slate-500 hover:bg-white/5 hover:text-white"
      }`}
    >
      <Icon size={18} className={active ? "" : "group-hover:text-indigo-400 transition-colors"} />
      <span className="text-sm font-bold tracking-tight">{label}</span>
    </button>
  );
}
