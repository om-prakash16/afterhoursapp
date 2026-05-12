"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  MessageSquare, 
  Wallet, 
  BookOpen,
  LayoutDashboard,
  Zap,
  Cpu,
  Star,
  Settings
} from "lucide-react";
import { motion } from "framer-motion";

export default function MobileNav() {
  const pathname = usePathname();

  if (pathname === "/login" || pathname === "/signup") return null;

  return (
    <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] z-50">
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="glass-morphism rounded-[2.5rem] border border-white/10 p-2 flex items-center justify-around shadow-2xl"
      >
        <MobileNavLink href="/dashboard" icon={LayoutDashboard} active={pathname === "/dashboard"} />
        <MobileNavLink href="/signals" icon={Zap} active={pathname === "/signals"} />
        
        <div className="relative -top-6">
           <Link href="/chat">
             <motion.div 
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.9 }}
               className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-2xl shadow-indigo-500/40 border-4 border-[#020617] relative"
             >
               <Cpu size={28} />
               <motion.div 
                 animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                 transition={{ duration: 2, repeat: Infinity }}
                 className="absolute inset-0 rounded-full bg-indigo-400"
               />
             </motion.div>
           </Link>
        </div>

        <MobileNavLink href="/social" icon={MessageSquare} active={pathname === "/social"} />
        <MobileNavLink href="/portfolio" icon={Wallet} active={pathname === "/portfolio"} />
      </motion.div>
    </div>
  );
}

function MobileNavLink({ href, icon: Icon, active }: any) {
  return (
    <Link href={href} className="relative p-3 group">
      {active && (
        <motion.div 
          layoutId="mobile-nav-active"
          className="absolute inset-0 bg-indigo-500/10 rounded-2xl"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
      <Icon 
        size={24} 
        className={`relative z-10 transition-colors duration-300 ${active ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300"}`} 
      />
    </Link>
  );
}
