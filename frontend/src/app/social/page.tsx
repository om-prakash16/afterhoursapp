"use client";

import { useEffect, useState } from "react";
import { 
  MessageSquare, 
  Heart, 
  Repeat2, 
  Share2, 
  CheckCircle2, 
  Activity, 
  Zap, 
  Search, 
  Cpu,
  ArrowUpRight,
  TrendingUp,
  AlertTriangle,
  Flame,
  Send
} from "lucide-react";
import { getSocialFeed, createSocialPost } from "@/lib/api";
import { SkeletonCard } from "@/components/ui/States";

export default function SocialPage() {
  const [feed, setFeed] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const data = await getSocialFeed();
        setFeed(data);
      } catch (err) {
        console.error("Feed fetch failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeed();
  }, []);

  const handlePost = async () => {
    if (!newPost) return;
    setIsPosting(true);
    setError("");
    try {
      await createSocialPost({ content: newPost });
      setNewPost("");
      // Refresh feed
      const data = await getSocialFeed();
      setFeed(data);
    } catch (err: any) {
      setError(err.response?.data?.detail || "AI Moderation Intervention.");
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 pb-20 pt-28 px-6">
      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Feed */}
        <div className="lg:col-span-8 space-y-8">
           
           {/* Post Input */}
           <div className="glass-morphism rounded-3xl border border-white/10 p-6 space-y-4 bg-black/20">
              <div className="flex gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-bold">
                    OP
                 </div>
                 <textarea 
                   value={newPost}
                   onChange={(e) => setNewPost(e.target.value)}
                   placeholder="Share your macro insight or trade post-mortem..."
                   className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-slate-200 placeholder:text-slate-600 resize-none h-24"
                 />
              </div>
              
              {error && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-[10px] text-rose-400 font-bold uppercase tracking-widest flex items-center gap-2 animate-in slide-in-from-top-2">
                   <AlertTriangle size={12} /> {error}
                </div>
              )}

              <div className="flex justify-between items-center pt-4 border-t border-white/5">
                 <div className="flex gap-4">
                    <button className="text-slate-500 hover:text-indigo-400 transition-colors"><Zap size={18} /></button>
                    <button className="text-slate-500 hover:text-indigo-400 transition-colors"><Activity size={18} /></button>
                    <button className="text-slate-500 hover:text-indigo-400 transition-colors"><TrendingUp size={18} /></button>
                 </div>
                 <button 
                   onClick={handlePost}
                   disabled={isPosting || !newPost}
                   className="px-6 py-2 rounded-xl bg-indigo-600 text-white font-black text-xs uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50"
                 >
                   {isPosting ? "Moderating..." : "Post Insight"}
                 </button>
              </div>
           </div>

           {/* Feed Items */}
           {loading ? (
             <div className="space-y-6">
                <SkeletonCard />
                <SkeletonCard />
             </div>
           ) : (
             <div className="space-y-6">
                {feed.map((post) => (
                  <div key={post.id} className="glass-morphism rounded-3xl border border-white/10 p-8 space-y-6 hover:bg-white/[0.03] transition-all group">
                     <div className="flex justify-between items-start">
                        <div className="flex gap-4">
                           <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-white/10 flex items-center justify-center font-bold text-white">
                              {post.user.name.charAt(0)}
                           </div>
                           <div>
                              <div className="flex items-center gap-2">
                                 <span className="font-bold text-white">{post.user.name}</span>
                                 {post.is_verified && <CheckCircle2 size={14} className="text-indigo-400" />}
                                 <span className="text-[10px] font-black text-indigo-400/60 uppercase tracking-widest">{post.user.rank}</span>
                              </div>
                              <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                                {new Date(post.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                           </div>
                        </div>
                        <button className="text-slate-600 hover:text-white transition-colors">
                           <Share2 size={16} />
                        </button>
                     </div>

                     <p className="text-sm text-slate-300 leading-relaxed font-medium">
                        {post.content}
                     </p>

                     {post.asset && (
                       <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest">
                          <Activity size={12} /> {post.asset}
                       </div>
                     )}

                     <div className="flex items-center gap-8 pt-6 border-t border-white/5">
                        <button className="flex items-center gap-2 text-slate-500 hover:text-rose-400 transition-colors group/btn">
                           <Heart size={18} className="group-hover/btn:fill-rose-400" />
                           <span className="text-xs font-bold">{post.reactions}</span>
                        </button>
                        <button className="flex items-center gap-2 text-slate-500 hover:text-indigo-400 transition-colors">
                           <MessageSquare size={18} />
                           <span className="text-xs font-bold">{post.comments}</span>
                        </button>
                        <button className="flex items-center gap-2 text-slate-500 hover:text-emerald-400 transition-colors">
                           <Repeat2 size={18} />
                        </button>
                     </div>
                  </div>
                ))}
             </div>
           )}
        </div>

        {/* Right Column: Trending & Aura */}
        <div className="lg:col-span-4 space-y-8">
           
           {/* Aura Social Audit */}
           <div className="glass-morphism rounded-[2.5rem] border border-indigo-500/20 p-8 space-y-6 bg-indigo-600/5">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg">
                    <Cpu size={20} />
                 </div>
                 <div>
                    <h4 className="text-sm font-black text-white uppercase tracking-tight">Social Guardian</h4>
                    <div className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Aura Moderation Active</div>
                 </div>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                "I am auditing the global intelligence feed in real-time. Spam and dangerous non-audited advice are autonomously filtered to ensure your cognitive safety."
              </p>
           </div>

           {/* Trending Assets */}
           <div className="glass-morphism rounded-[2.5rem] border border-white/10 p-8 space-y-6">
              <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                 <Flame size={14} className="text-rose-500" /> Hot Intelligence
              </h4>
              <div className="space-y-4">
                 <TrendingItem symbol="BTC/USDT" volume="+12% Insight" />
                 <TrendingItem symbol="ETH/USDT" volume="+8% Activity" />
                 <TrendingItem symbol="SOL/USDT" volume="+24% Mentions" />
              </div>
           </div>

        </div>

      </div>
    </div>
  );
}

function TrendingItem({ symbol, volume }: any) {
  return (
    <div className="flex justify-between items-center group cursor-pointer">
       <span className="text-xs font-bold text-slate-400 group-hover:text-white transition-colors">{symbol}</span>
       <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{volume}</span>
    </div>
  );
}
