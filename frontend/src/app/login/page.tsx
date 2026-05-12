"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Mail, Lock, AlertCircle } from "lucide-react";

import { login as apiLogin } from "@/lib/api";
import { useAuth } from "@/components/auth/AuthProvider";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const data = await apiLogin(email, password);
      login(data.access_token, data.user);
    } catch (err: any) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden text-slate-200">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-900/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-900/20 blur-[120px] rounded-full" />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Link href="/" className="flex items-center gap-2 text-white font-bold text-2xl">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <Sparkles size={22} />
            </div>
            <span>AfterHours</span>
          </Link>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">
          Welcome back
        </h2>
        <p className="mt-2 text-center text-sm text-slate-400">
          Or{" "}
          <Link href="/signup" className="font-bold text-indigo-400 hover:text-indigo-300">
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="glass-morphism py-10 px-6 sm:px-10 rounded-[2.5rem] border border-white/10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-3 text-rose-400 text-sm animate-in fade-in slide-in-from-top-2">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            <div className="space-y-1">
              <label htmlFor="email" className="block text-sm font-bold text-slate-400 ml-1">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                  <Mail size={18} />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 border border-white/10 rounded-2xl bg-white/5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm transition-all"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="password" className="block text-sm font-bold text-slate-400 ml-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                  <Lock size={18} />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 border border-white/10 rounded-2xl bg-white/5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 bg-white/5 border-white/10 rounded focus:ring-indigo-500 text-indigo-600 transition-all"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-400">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-bold text-indigo-400 hover:text-indigo-300">
                  Forgot password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent text-lg font-bold rounded-2xl text-white bg-indigo-600 hover:bg-indigo-500 hover:shadow-[0_0_20px_rgba(79,70,229,0.3)] focus:outline-none transition-all active:scale-[0.98] disabled:opacity-70"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Sign in
                    <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
