"use client";

import { useState } from "react";
import { 
  ShieldCheck, 
  AlertTriangle, 
  ArrowRight, 
  Heart, 
  Zap, 
  Brain, 
  ChevronRight,
  TrendingUp,
  XCircle,
  CheckCircle2
} from "lucide-react";
import { submitEmotionalCheck } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function TradeCheckPage() {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    last_trade: "",
    mood: "",
    urgency: ""
  });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleFinish = async () => {
    setLoading(true);
    try {
      const data = await submitEmotionalCheck(answers, { asset: "BTC/USDT", size: 1.0 });
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6">
        <div className="max-w-xl w-full glass-morphism rounded-[2.5rem] border border-white/10 p-10 text-center space-y-8 animate-in fade-in zoom-in duration-500">
          <div className={`mx-auto w-20 h-20 rounded-3xl flex items-center justify-center ${
            result.level === "HIGH" ? "bg-rose-500/20 text-rose-400" : 
            result.level === "MEDIUM" ? "bg-amber-500/20 text-amber-400" : 
            "bg-emerald-500/20 text-emerald-400"
          }`}>
            {result.level === "HIGH" ? <XCircle size={40} /> : 
             result.level === "MEDIUM" ? <AlertTriangle size={40} /> : 
             <CheckCircle2 size={40} />}
          </div>

          <div className="space-y-2">
            <div className="text-[10px] uppercase font-black tracking-widest text-slate-500">Aura Analysis Result</div>
            <h2 className="text-3xl font-black text-white italic">{result.risk.replace('_', ' ')}</h2>
            <div className={`inline-block px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
              result.level === "HIGH" ? "bg-rose-500 text-white" : 
              result.level === "MEDIUM" ? "bg-amber-500 text-slate-900" : 
              "bg-emerald-500 text-white"
            }`}>
              {result.level} RISK DETECTED
            </div>
          </div>

          <p className="text-slate-400 leading-relaxed text-lg">
            "{result.recommendation}"
          </p>

          <div className="pt-6 flex flex-col gap-4">
            {result.level === "HIGH" ? (
              <button 
                onClick={() => router.push("/dashboard")}
                className="w-full py-5 rounded-2xl bg-white text-slate-950 font-black text-sm uppercase tracking-widest hover:bg-slate-200 transition-all"
              >
                Accept Advice & Stop
              </button>
            ) : (
              <button 
                onClick={() => router.push("/signals")}
                className="w-full py-5 rounded-2xl bg-indigo-600 text-white font-black text-sm uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-500/20"
              >
                Proceed to Trade
              </button>
            )}
            <button 
              onClick={() => setResult(null)}
              className="text-xs font-bold text-slate-500 uppercase tracking-widest hover:text-white transition-colors"
            >
              Re-take Analysis
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center p-6 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full -z-10" />
      
      <div className="max-w-2xl w-full space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-indigo-400 text-[10px] font-black uppercase tracking-widest">
            <ShieldCheck size={14} /> Emotional Guard System
          </div>
          <h1 className="text-4xl font-black tracking-tight">Pre-Flight Check.</h1>
          <p className="text-slate-500">Every pro pilot does a checklist. Every pro trader should do a psychological audit.</p>
        </div>

        {/* Progress Bar */}
        <div className="flex gap-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= s ? "bg-indigo-500" : "bg-white/5"}`} />
          ))}
        </div>

        <div className="glass-morphism rounded-[2.5rem] border border-white/10 p-10 relative overflow-hidden">
          
          {step === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="space-y-2 text-center">
                <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 w-fit mx-auto">
                  <TrendingUp size={24} />
                </div>
                <h2 className="text-xl font-bold">How did your last trade end?</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <OptionCard 
                  label="Big Win" 
                  selected={answers.last_trade === "WIN"} 
                  onClick={() => { setAnswers({...answers, last_trade: "WIN"}); setStep(2); }} 
                />
                <OptionCard 
                  label="Loss" 
                  selected={answers.last_trade === "LOSS"} 
                  onClick={() => { setAnswers({...answers, last_trade: "LOSS"}); setStep(2); }} 
                />
                <OptionCard 
                  label="No Trade Today" 
                  selected={answers.last_trade === "NA"} 
                  onClick={() => { setAnswers({...answers, last_trade: "NA"}); setStep(2); }} 
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="space-y-2 text-center">
                <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-400 w-fit mx-auto">
                  <Heart size={24} />
                </div>
                <h2 className="text-xl font-bold">What's your dominant emotion?</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <OptionCard label="Excited / Euphoric" onClick={() => { setAnswers({...answers, mood: "EXCITED"}); setStep(3); }} />
                <OptionCard label="Anxious / Fearful" onClick={() => { setAnswers({...answers, mood: "FEARFUL"}); setStep(3); }} />
                <OptionCard label="Neutral / Calm" onClick={() => { setAnswers({...answers, mood: "NEUTRAL"}); setStep(3); }} />
                <OptionCard label="Revengeful" onClick={() => { setAnswers({...answers, mood: "REVENGEFUL"}); setStep(3); }} />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="space-y-2 text-center">
                <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 w-fit mx-auto">
                  <Zap size={24} />
                </div>
                <h2 className="text-xl font-bold">How urgent is this trade?</h2>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <OptionCard label="EXTREME - I need to get in NOW" onClick={() => setAnswers({...answers, urgency: "HIGH"})} selected={answers.urgency === "HIGH"} />
                <OptionCard label="MODERATE - Following a setup" onClick={() => setAnswers({...answers, urgency: "MEDIUM"})} selected={answers.urgency === "MEDIUM"} />
                <OptionCard label="LOW - Patiently waiting" onClick={() => setAnswers({...answers, urgency: "LOW"})} selected={answers.urgency === "LOW"} />
              </div>
              <button 
                disabled={!answers.urgency || loading}
                onClick={handleFinish}
                className="w-full h-14 rounded-2xl bg-white text-slate-950 font-black text-sm uppercase tracking-widest hover:bg-slate-200 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? "Analyzing..." : "Analyze My State"}
                {!loading && <Brain size={18} />}
              </button>
            </div>
          )}

        </div>

        {step > 1 && (
          <button 
            onClick={() => setStep(step - 1)}
            className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors mx-auto"
          >
            Go Back
          </button>
        )}
      </div>
    </div>
  );
}

function OptionCard({ label, onClick, selected }: any) {
  return (
    <button 
      onClick={onClick}
      className={`p-6 rounded-[1.5rem] border transition-all text-center group ${
        selected ? "bg-indigo-600 border-indigo-500 text-white shadow-lg" : "bg-white/5 border-white/5 text-slate-300 hover:border-white/20 hover:bg-white/10"
      }`}
    >
      <div className={`text-sm font-bold uppercase tracking-tight ${selected ? "text-white" : "text-slate-300 group-hover:text-white"}`}>
        {label}
      </div>
    </button>
  );
}
