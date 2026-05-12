"use client";

import { useEffect, useState } from "react";
import { 
  MessageSquare, 
  Search, 
  Clock, 
  ArrowRight, 
  Brain, 
  ShieldCheck, 
  Activity,
  History,
  MoreVertical,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import { getChatHistory } from "@/lib/api";

export default function ChatHistoryPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getChatHistory();
        setHistory(data);
      } catch (err) {
        console.error("History fetch error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const filteredHistory = history.filter(h => 
    h.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.response.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 pb-20 pt-28 px-6">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-indigo-400">
              <History size={32} />
              <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Intelligence Logs</h1>
            </div>
            <p className="text-slate-500 max-w-xl font-medium">
              Every interaction with Aura is recorded. Search your strategic history to audit previous recommendations and emotional states.
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
          <input 
            type="text" 
            placeholder="Search within conversations (e.g. 'Bitcoin', 'Risk', 'Patience')..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-[2rem] py-6 pl-16 pr-8 text-lg focus:outline-none focus:border-indigo-500 transition-all shadow-2xl"
          />
        </div>

        {/* History List */}
        <div className="space-y-4">
          {filteredHistory.map((chat) => (
            <HistoryItem key={chat.id} chat={chat} />
          ))}

          {filteredHistory.length === 0 && (
            <div className="glass-morphism rounded-[2.5rem] border border-white/10 p-20 text-center">
              <MessageSquare size={48} className="text-slate-700 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white uppercase tracking-tight">No Strategic Logs Found</h3>
              <p className="text-slate-500 mt-2">Try searching for different keywords or start a new session with Aura.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

function HistoryItem({ chat }: { chat: any }) {
  return (
    <Link href={`/chat?resume=${chat.id}`}>
      <div className="glass-morphism rounded-[2rem] border border-white/10 p-8 flex items-center justify-between group hover:border-white/20 transition-all cursor-pointer bg-white/[0.01]">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500 group-hover:bg-indigo-600 group-hover:text-white transition-all">
            <Brain size={24} />
          </div>
          <div className="space-y-1">
            <div className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <Clock size={12} />
              {new Date(chat.created_at).toLocaleDateString()} at {new Date(chat.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <h4 className="text-lg font-bold text-white tracking-tight line-clamp-1 max-w-lg">
              {chat.message}
            </h4>
            <p className="text-sm text-slate-500 line-clamp-1 max-w-lg">
              {chat.response}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          {chat.mood_detected && (
            <div className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-white/5 border border-white/10 ${
              ["stressed", "panic"].includes(chat.mood_detected) ? "text-rose-400" : "text-emerald-400"
            }`}>
              {chat.mood_detected}
            </div>
          )}
          <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-slate-600 group-hover:text-white transition-colors">
            <ChevronRight size={20} />
          </div>
        </div>
      </div>
    </Link>
  );
}
