"use client";

import Link from "next/link";
import { 
  Zap, 
  Shield, 
  Brain, 
  ArrowRight, 
  Cpu, 
  BarChart3, 
  Lock,
  ChevronRight,
  Sparkles
} from "lucide-react";
import Navbar from "@/components/Navbar";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 overflow-hidden">
      <Navbar />
      
      {/* Background Animated Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/20 blur-[150px] rounded-full -z-10 animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-emerald-600/10 blur-[150px] rounded-full -z-10 animate-pulse" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none -z-5" />

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center space-y-10">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-black uppercase tracking-widest animate-fade-in-up">
            <Sparkles size={14} />
            The Billion Dollar Trading DNA Engine is Live
          </div>

          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-[0.9] max-w-5xl mx-auto uppercase">
            Trade with the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-emerald-400 to-indigo-500 animate-gradient">Intelligence</span> of Aura.
          </h1>

          <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto font-medium leading-relaxed">
            AfterHours is the world's first AI-native trading ecosystem that translates institutional intelligence into your unique psychological DNA.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
            <Link 
              href="/signup" 
              className="group relative px-10 py-5 rounded-2xl bg-indigo-600 text-white font-black text-sm uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-2xl shadow-indigo-600/40 active:scale-95 flex items-center gap-3 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              Initialize Your DNA
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/login" 
              className="px-10 py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-black text-sm uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-3"
            >
              Launch Terminal
            </Link>
          </div>

          {/* Visual Showcase */}
          <div className="pt-20 relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-full bg-indigo-600/20 blur-[100px] rounded-full -z-10" />
            <div className="glass-morphism rounded-[3rem] border border-white/10 p-4 shadow-2xl scale-[1.02] transform hover:scale-[1.05] transition-all duration-700">
              <div className="rounded-[2.5rem] overflow-hidden border border-white/5 relative">
                 <img 
                   src="https://images.unsplash.com/photo-1611974717537-48358a60268a?q=80&w=2070&auto=format&fit=crop" 
                   alt="AfterHours Terminal" 
                   className="w-full h-auto opacity-80"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent" />
                 
                 {/* Floating Aura Elements */}
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex items-center justify-center pointer-events-none">
                    <div className="w-[80%] h-[80%] border border-indigo-500/20 rounded-full animate-ping opacity-20" />
                    <div className="absolute w-[60%] h-[60%] border border-emerald-500/10 rounded-full animate-pulse delay-700 opacity-10" />
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Pillars */}
      <section className="py-32 px-6 bg-white/[0.01] border-y border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <FeatureCard 
            icon={Brain} 
            title="Psychological Guard" 
            desc="Aura detects emotional instability in your chat history and automatically tightens risk parameters to protect your capital."
          />
          <FeatureCard 
            icon={Shield} 
            title="Guarded Capital" 
            desc="90% of your wallet is protected by our proprietary DNA-shield, ensuring drawdown never exceeds your psychological threshold."
          />
          <FeatureCard 
            icon={Zap} 
            title="Institutional Translation" 
            desc="We take signals from the world's top desks and translate them into entry points that fit your specific Trade DNA archetype."
          />
        </div>
      </section>

      {/* CTA Footer */}
      <footer className="py-32 px-6 text-center space-y-12">
        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase max-w-3xl mx-auto">
          The market sleeps. <br /><span className="text-indigo-500">Aura never does.</span>
        </h2>
        <Link 
          href="/signup" 
          className="inline-flex items-center gap-3 text-indigo-400 font-black text-xs uppercase tracking-[0.3em] hover:text-white transition-all group"
        >
          Become an Elite Trader <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
        <div className="pt-20 flex flex-col items-center gap-4 border-t border-white/5">
          <div className="flex items-center gap-2 text-xl font-bold text-white">
            <Cpu size={24} className="text-indigo-600" />
            AfterHours
          </div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">© 2024 AfterHours AI Research. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc }: any) {
  return (
    <div className="space-y-6 group">
      <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-indigo-500 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
        <Icon size={32} />
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-black text-white uppercase tracking-tight">{title}</h3>
        <p className="text-slate-400 leading-relaxed font-medium">
          {desc}
        </p>
      </div>
    </div>
  );
}
