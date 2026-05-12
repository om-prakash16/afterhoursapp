"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  TrendingUp, 
  Target, 
  Wallet, 
  BarChart, 
  ChevronRight, 
  ChevronLeft, 
  Check,
  Zap,
  Shield,
  Clock
} from "lucide-react";
import { submitOnboarding } from "@/lib/api";

const steps = [
  { id: 1, title: "Experience", icon: BarChart },
  { id: 2, title: "Risk Profile", icon: Shield },
  { id: 3, title: "Capital", icon: Wallet },
  { id: 4, title: "Goals", icon: Target },
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    experience: "Intermediate",
    risk_tolerance: "Moderate",
    patience: 5,
    aggression: 5,
    account_size: 5000,
    goals: [] as string[],
    preferred_assets: ["BTC", "ETH"] as string[]
  });

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await submitOnboarding(formData);
      router.push("/dashboard");
    } catch (error) {
      console.error("Onboarding failed", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-900/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-900/10 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-3xl w-full">
        {/* Progress Bar */}
        <div className="flex justify-between items-center mb-12 relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-white/5 -z-10" />
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-indigo-500 transition-all duration-500 -z-10" 
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          />
          {steps.map((step) => {
            const Icon = step.icon;
            const isCompleted = step.id < currentStep;
            const isActive = step.id === currentStep;

            return (
              <div key={step.id} className="flex flex-col items-center gap-3">
                <div 
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                    isCompleted ? "bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)]" :
                    isActive ? "bg-white text-slate-950 shadow-xl" : "bg-slate-900 text-slate-500 border border-white/5"
                  }`}
                >
                  {isCompleted ? <Check size={20} /> : <Icon size={20} />}
                </div>
                <span className={`text-[10px] uppercase font-black tracking-widest ${isActive ? "text-white" : "text-slate-500"}`}>
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>

        {/* Form Container */}
        <div className="glass-morphism rounded-[2.5rem] border border-white/10 p-8 md:p-12 relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-3xl font-bold text-white">Your Experience.</h2>
                    <p className="text-slate-400">This helps us tailor the Signal Translator to your level.</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {["Beginner", "Intermediate", "Advanced", "Expert"].map((level) => (
                      <button
                        key={level}
                        onClick={() => setFormData({ ...formData, experience: level })}
                        className={`p-6 rounded-2xl text-left border transition-all ${
                          formData.experience === level 
                            ? "bg-indigo-600/10 border-indigo-500 text-white shadow-inner" 
                            : "bg-white/5 border-white/5 text-slate-400 hover:bg-white/10"
                        }`}
                      >
                        <div className="font-bold text-lg mb-1">{level}</div>
                        <div className="text-xs opacity-60">
                          {level === "Beginner" && "Just starting out, need guidance."}
                          {level === "Intermediate" && "I know the basics and trade regularly."}
                          {level === "Advanced" && "Professional setups and risk management."}
                          {level === "Expert" && "Institutional level knowledge and tools."}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-10">
                  <div className="space-y-2">
                    <h2 className="text-3xl font-bold text-white">Risk DNA.</h2>
                    <p className="text-slate-400">Define how you handle market volatility.</p>
                  </div>
                  
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
                          <Clock size={16} className="text-indigo-400" />
                          Patience Level
                        </label>
                        <span className="text-indigo-400 font-black">{formData.patience}/10</span>
                      </div>
                      <input 
                        type="range" min="1" max="10" 
                        value={formData.patience}
                        onChange={(e) => setFormData({...formData, patience: parseInt(e.target.value)})}
                        className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                      />
                      <div className="flex justify-between text-[10px] text-slate-500 uppercase font-bold">
                        <span>Scalper</span>
                        <span>Long-term</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
                          <Zap size={16} className="text-emerald-400" />
                          Aggression
                        </label>
                        <span className="text-emerald-400 font-black">{formData.aggression}/10</span>
                      </div>
                      <input 
                        type="range" min="1" max="10" 
                        value={formData.aggression}
                        onChange={(e) => setFormData({...formData, aggression: parseInt(e.target.value)})}
                        className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                      <div className="flex justify-between text-[10px] text-slate-500 uppercase font-bold">
                        <span>Conservative</span>
                        <span>Degen Mode</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 flex items-start gap-4">
                    <Shield className="text-indigo-400 mt-1 shrink-0" size={24} />
                    <p className="text-sm text-slate-400 leading-relaxed">
                      Your DNA will be used to <span className="text-white font-bold">automatically resize</span> institutional signals to fit your psychological profile.
                    </p>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-8">
                  <div className="space-y-2">
                    <h2 className="text-3xl font-bold text-white">Capital & Assets.</h2>
                    <p className="text-slate-400">Tell us about your portfolio size and preferences.</p>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Initial Account Size ($)</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                          <span className="font-bold">$</span>
                        </div>
                        <input
                          type="number"
                          value={formData.account_size}
                          onChange={(e) => setFormData({...formData, account_size: parseFloat(e.target.value)})}
                          className="block w-full pl-10 pr-4 py-4 border border-white/10 rounded-2xl bg-white/5 text-white font-bold text-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Primary Asset Classes</label>
                      <div className="flex flex-wrap gap-3">
                        {["Crypto", "Forex", "Stocks", "Commodities"].map((asset) => (
                          <button
                            key={asset}
                            onClick={() => {
                              const assets = formData.preferred_assets.includes(asset)
                                ? formData.preferred_assets.filter(a => a !== asset)
                                : [...formData.preferred_assets, asset];
                              setFormData({...formData, preferred_assets: assets});
                            }}
                            className={`px-6 py-3 rounded-xl border transition-all font-bold ${
                              formData.preferred_assets.includes(asset)
                                ? "bg-white text-slate-950 border-white shadow-xl"
                                : "bg-white/5 border-white/5 text-slate-400 hover:bg-white/10"
                            }`}
                          >
                            {asset}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-8">
                  <div className="space-y-2">
                    <h2 className="text-3xl font-bold text-white">Trading Goals.</h2>
                    <p className="text-slate-400">What are you looking to achieve with AfterHours?</p>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {[
                      { id: "income", title: "Daily Passive Income", desc: "Small frequent wins to cover daily expenses." },
                      { id: "growth", title: "Aggressive Account Growth", desc: "Focus on compounding and high-risk setups." },
                      { id: "learning", title: "Learn Institutional Logic", desc: "Understand how pro traders structure their moves." },
                      { id: "signals", title: "Automated Signal Copying", desc: "Execute pro signals with zero manual effort." }
                    ].map((goal) => (
                      <button
                        key={goal.id}
                        onClick={() => {
                          const goals = formData.goals.includes(goal.id)
                            ? formData.goals.filter(g => g !== goal.id)
                            : [...formData.goals, goal.id];
                          setFormData({...formData, goals});
                        }}
                        className={`p-6 rounded-2xl text-left border transition-all flex items-center justify-between ${
                          formData.goals.includes(goal.id) 
                            ? "bg-indigo-600/10 border-indigo-500 text-white shadow-inner" 
                            : "bg-white/5 border-white/5 text-slate-400 hover:bg-white/10"
                        }`}
                      >
                        <div>
                          <div className="font-bold text-lg mb-1">{goal.title}</div>
                          <div className="text-xs opacity-60">{goal.desc}</div>
                        </div>
                        {formData.goals.includes(goal.id) && (
                          <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center">
                            <Check size={14} className="text-white" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-12 pt-8 border-t border-white/5">
            <button
              onClick={handleBack}
              disabled={currentStep === 1 || loading}
              className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors disabled:opacity-0"
            >
              <ChevronLeft size={20} />
              <span className="font-bold uppercase tracking-widest text-xs">Previous</span>
            </button>
            <button
              onClick={handleNext}
              disabled={loading}
              className="group flex items-center justify-center gap-2 h-14 px-10 rounded-2xl bg-white text-slate-950 font-bold text-lg transition-all hover:bg-indigo-50 hover:shadow-xl active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-slate-950/20 border-t-slate-950 rounded-full animate-spin" />
              ) : (
                <>
                  {currentStep === steps.length ? "Generate Trade DNA" : "Continue"}
                  <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
