"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { 
  MessageSquare, 
  LayoutDashboard, 
  Cpu, 
  Zap, 
  LogOut, 
  Wallet, 
  BarChart3, 
  Trophy, 
  History as HistoryIcon, 
  Bell, 
  BookOpen, 
  Activity, 
  Info, 
  ChevronDown,
  Search,
  Settings
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import NotificationSidebar from "@/components/dashboard/NotificationSidebar";

const CORE_LINKS = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Home" },
  { href: "/signals", icon: Zap, label: "Signals" },
  { href: "/portfolio", icon: Wallet, label: "Vault" },
  { href: "/chat", icon: Cpu, label: "Aura AI" },
];

const TOOL_LINKS = [
  { href: "/performance", icon: Activity, label: "Performance Stats" },
  { href: "/transparency", icon: Info, label: "XAI Transparency" },
  { href: "/journal", icon: BookOpen, label: "Trading Journal" },
  { href: "/analytics", icon: BarChart3, label: "Audit Analytics" },
  { href: "/leaderboard", icon: Trophy, label: "Alpha Leaderboard" },
  { href: "/social", icon: MessageSquare, label: "Pulse Social" },
  { href: "/chat/history", icon: HistoryIcon, label: "Interaction Logs" },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const toolsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (toolsRef.current && !toolsRef.current.contains(event.target as Node)) {
        setIsToolsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (pathname === "/login" || pathname === "/signup") return null;

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 px-4 py-4 md:px-8 md:py-6 pointer-events-none">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="max-w-7xl mx-auto flex justify-between items-center glass px-4 py-2 md:px-6 md:py-3 rounded-2xl border-white/5 shadow-2xl pointer-events-auto"
        >
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-3 font-bold text-xl tracking-tight text-white shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform duration-300">
              <Cpu size={22} className="text-white" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-lg font-outfit">AfterHours</span>
              <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-[0.2em]">Alpha v2.4</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden lg:flex items-center gap-1">
            {CORE_LINKS.map((link) => (
              <NavLink 
                key={link.href}
                href={link.href} 
                icon={link.icon} 
                label={link.label} 
                active={pathname === link.href} 
              />
            ))}

            {/* Tools Dropdown */}
            <div className="relative ml-2 pl-2 border-l border-white/10" ref={toolsRef}>
              <button 
                onClick={() => setIsToolsOpen(!isToolsOpen)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all group hover:bg-white/5 ${isToolsOpen ? "text-white" : "text-slate-400"}`}
              >
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-indigo-500/20 group-hover:text-indigo-400 transition-colors">
                  <Settings size={16} />
                </div>
                <span className="text-sm font-bold tracking-tight">More Tools</span>
                <ChevronDown size={14} className={`transition-transform duration-300 ${isToolsOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {isToolsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full right-0 mt-3 w-64 glass-dropdown rounded-2xl p-2 border border-white/10 shadow-2xl overflow-hidden"
                  >
                    <div className="grid grid-cols-1 gap-1">
                      {TOOL_LINKS.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setIsToolsOpen(false)}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all hover:bg-white/5 group ${
                            pathname === link.href ? "text-indigo-400 bg-indigo-500/5" : "text-slate-400 hover:text-white"
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                            pathname === link.href ? "bg-indigo-500/20 text-indigo-400" : "bg-white/5 text-slate-500 group-hover:text-slate-200"
                          }`}>
                            <link.icon size={16} />
                          </div>
                          <span className="text-sm font-semibold">{link.label}</span>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* User Section */}
          <div className="flex items-center gap-3 md:gap-4">
            {user ? (
              <>
                <button 
                  onClick={() => setIsNotifOpen(true)}
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 hover:border-indigo-500/20 transition-all active:scale-95 group relative"
                >
                  <Bell size={18} />
                  <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-indigo-500 rounded-full border-2 border-[#020617] animate-pulse" />
                </button>

                <div className="hidden sm:flex items-center gap-3 pl-2 border-l border-white/10">
                  <div className="flex flex-col items-end mr-1">
                    <span className="text-sm font-bold text-white leading-none">{user.full_name.split(' ')[0]}</span>
                    <span className="text-[9px] text-indigo-400/80 font-bold uppercase tracking-widest mt-1">Pro Member</span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-[1px] shadow-lg shadow-indigo-500/20">
                    <div className="w-full h-full rounded-[11px] bg-[#020617] flex items-center justify-center overflow-hidden">
                       <div className="text-indigo-400 font-bold text-xs">{user.full_name.charAt(0)}</div>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={logout}
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/20 transition-all active:scale-95 group"
                  title="Logout"
                >
                  <LogOut size={18} className="group-hover:-translate-x-0.5 transition-transform" />
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login" className="text-sm font-bold text-slate-400 hover:text-white transition-colors px-4 py-2">Login</Link>
                <Link 
                  href="/signup" 
                  className="bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/20 transition-all active:scale-95"
                >
                  Join Now
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      </nav>
      <NotificationSidebar isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
    </>
  );
}

function NavLink({ href, icon: Icon, label, active }: { href: string, icon: any, label: string, active: boolean }) {
  return (
    <Link 
      href={href} 
      className={`relative flex items-center gap-2 px-4 py-2 rounded-xl transition-all group ${
        active 
          ? "text-indigo-400" 
          : "text-slate-400 hover:text-white"
      }`}
    >
      {active && (
        <motion.div 
          layoutId="nav-active"
          className="absolute inset-0 bg-indigo-500/10 border border-indigo-500/20 rounded-xl"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
      <Icon size={18} className={`relative z-10 ${active ? "text-indigo-400" : "group-hover:scale-110 group-hover:text-indigo-400"} transition-all duration-300`} />
      <span className="relative z-10 text-sm font-bold tracking-tight">{label}</span>
    </Link>
  );
}
