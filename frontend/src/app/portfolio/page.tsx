"use client";

import { useEffect, useState } from "react";
import { 
  Wallet, 
  ShieldCheck, 
  TrendingUp, 
  TrendingDown, 
  Filter, 
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  History,
  PieChart as PieChartIcon,
  BarChart3,
  Calendar
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { getPortfolioSummary, getTradeHistory, getPerformanceData } from "@/lib/api";
import ProtectionLayer from "@/components/portfolio/ProtectionLayer";
import KillSwitch from "@/components/portfolio/KillSwitch";
import DiversificationRadar from "@/components/portfolio/DiversificationRadar";
import RiskForecastChart from "@/components/portfolio/RiskForecastChart";

export default function PortfolioPage() {
  const [stats, setStats] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [perfData, setPerfData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [s, h, p] = await Promise.all([
          getPortfolioSummary(),
          getTradeHistory(),
          getPerformanceData()
        ]);
        setStats(s);
        setHistory(h);
        setPerfData(p);
      } catch (err) {
        console.error("Failed to fetch portfolio data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading || !stats) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 pb-20 pt-28 px-6">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-emerald-400">
              <Wallet size={32} />
              <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Guarded Capital</h1>
            </div>
            <p className="text-slate-500 max-w-xl font-medium">
              Your professional command center. Aura ensures that 90% of your capital remains "Guarded" and untouched by high-risk volatility.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-black text-xs uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20 active:scale-95">
              Deposit
            </button>
            <button className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all active:scale-95">
              Withdraw
            </button>
            <KillSwitch />
          </div>
        </div>

        {/* Hero Section: Guarded Capital Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            label="Total Balance" 
            value={`$${stats.total_balance.toLocaleString()}`} 
            sub="Global Wallet" 
            icon={Wallet} 
            color="text-white" 
          />
          <StatCard 
            label="Guarded Capital" 
            value={`$${stats.guarded_capital.toLocaleString()}`} 
            sub="Protected from Risk" 
            icon={ShieldCheck} 
            color="text-emerald-400" 
            isPrimary
          />
          <StatCard 
            label="Risk Exposure" 
            value={`$${stats.risk_exposure.toLocaleString()}`} 
            sub={`${stats.active_trades_count} Active Trades`} 
            icon={Activity} 
            color="text-rose-400" 
          />
          <StatCard 
            label="Net Profit" 
            value={`+$${stats.total_profit.toLocaleString()}`} 
            sub={`Win Rate: ${stats.win_rate}%`} 
            icon={TrendingUp} 
            color="text-indigo-400" 
          />
        </div>

        <ProtectionLayer />
        
        <DiversificationRadar />

        <RiskForecastChart />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Performance Chart */}
          <div className="lg:col-span-8 glass-morphism rounded-[2.5rem] border border-white/10 p-8 space-y-6">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <BarChart3 size={20} className="text-indigo-500" />
                  Equity Curve
                </h3>
                <p className="text-xs text-slate-500 uppercase font-black tracking-widest">Performance History</p>
              </div>
              <div className="flex gap-2">
                {["1D", "1W", "1M", "ALL"].map(t => (
                  <button key={t} className={`px-3 py-1 rounded-lg text-[10px] font-black transition-all ${t === "1M" ? "bg-indigo-600 text-white" : "bg-white/5 text-slate-500 hover:text-white"}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={perfData}>
                  <defs>
                    <linearGradient id="colorPnl" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: "#64748b", fontSize: 10 }} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: "#64748b", fontSize: 10 }} 
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" }}
                    itemStyle={{ color: "#818cf8" }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="pnl" 
                    stroke="#6366f1" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#colorPnl)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Holdings Summary */}
          <div className="lg:col-span-4 glass-morphism rounded-[2.5rem] border border-white/10 p-8 space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <PieChartIcon size={20} className="text-indigo-500" />
              Asset Allocation
            </h3>
            <div className="space-y-4">
              <AllocationItem asset="Bitcoin" percent={65} color="bg-amber-500" />
              <AllocationItem asset="Solana" percent={20} color="bg-purple-500" />
              <AllocationItem asset="Ethereum" percent={10} color="bg-indigo-500" />
              <AllocationItem asset="Others" percent={5} color="bg-slate-500" />
            </div>
            <div className="pt-6 border-t border-white/5 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">Max Drawdown</span>
                <span className="text-sm font-black text-rose-400">-{stats.max_drawdown}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">Sharpe Ratio</span>
                <span className="text-sm font-black text-emerald-400">2.4</span>
              </div>
            </div>
          </div>

        </div>

        {/* Trade History Section */}
        <div className="glass-morphism rounded-[2.5rem] border border-white/10 overflow-hidden">
          <div className="p-8 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <History size={20} className="text-indigo-500" />
                Trade History
              </h3>
              <p className="text-xs text-slate-500 uppercase font-black tracking-widest">Transaction Audit Trail</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input 
                  type="text" 
                  placeholder="Search Asset..." 
                  className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-indigo-500 transition-all w-full md:w-64"
                />
              </div>
              <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all">
                <Filter size={18} />
              </button>
            </div>
          </div>

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/5">
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Asset</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Side</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Size (USDT)</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Status</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">PnL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {history.map((trade) => (
                <tr key={trade.id} className="hover:bg-white/5 transition-all group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center font-bold text-white uppercase">
                        {trade.asset.charAt(0)}
                      </div>
                      <span className="font-bold text-white">{trade.asset}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${trade.side === "BUY" ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"}`}>
                      {trade.side}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="font-mono font-bold text-white">${trade.size.toLocaleString()}</div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase">{trade.leverage}x Leverage</div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${trade.status === "OPEN" ? "bg-indigo-500/10 text-indigo-400 animate-pulse" : "bg-slate-500/10 text-slate-500"}`}>
                      {trade.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className={`font-mono font-bold flex items-center justify-end gap-1 ${trade.pnl_usdt >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                      {trade.pnl_usdt >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                      {trade.pnl_usdt >= 0 ? "+" : ""}${Math.abs(trade.pnl_usdt).toLocaleString()}
                    </div>
                    <div className={`text-[10px] font-black uppercase ${trade.pnl_percent >= 0 ? "text-emerald-500/60" : "text-rose-500/60"}`}>
                      {trade.pnl_percent}% ROI
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-6 bg-white/5 border-t border-white/5 text-center">
            <button className="text-xs font-black text-indigo-400 uppercase tracking-widest hover:text-indigo-300 transition-colors">
              Load More Activity
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

function StatCard({ label, value, sub, icon: Icon, color, isPrimary }: any) {
  return (
    <div className={`p-8 glass-morphism rounded-[2.5rem] border border-white/10 space-y-4 relative overflow-hidden transition-all hover:scale-[1.02] ${isPrimary ? "bg-gradient-to-br from-indigo-600/20 to-transparent border-indigo-500/20" : ""}`}>
      {isPrimary && <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[60px] rounded-full -z-10" />}
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isPrimary ? "bg-indigo-600 text-white shadow-xl shadow-indigo-500/20" : "bg-white/5 text-slate-400"}`}>
        <Icon size={24} />
      </div>
      <div className="space-y-1">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">{label}</h4>
        <div className={`text-3xl font-black ${color}`}>{value}</div>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{sub}</p>
      </div>
    </div>
  );
}

function AllocationItem({ asset, percent, color }: any) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-xs">
        <span className="font-bold text-slate-300">{asset}</span>
        <span className="font-black text-white">{percent}%</span>
      </div>
      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
