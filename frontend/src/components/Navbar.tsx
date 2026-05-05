import Link from "next/link";
import { MessageSquare, LayoutDashboard, Sparkles, User as UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Navbar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:top-0 md:bottom-auto bg-white/80 backdrop-blur-xl border-t md:border-t-0 md:border-b border-slate-200 px-4 py-3 md:py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/dashboard" className="hidden md:flex items-center gap-2 text-indigo-600 font-bold text-xl">
          <Sparkles className="fill-indigo-600" />
          <span>Aura</span>
        </Link>

        <div className="flex flex-1 md:flex-none justify-around md:justify-end items-center gap-1 md:gap-8">
          <NavLink href="/dashboard" icon={LayoutDashboard} label="Dashboard" />
          <NavLink href="/chat" icon={MessageSquare} label="Chat" />
          <NavLink href="/profile" icon={UserIcon} label="Profile" />
        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, icon: Icon, label }: { href: string, icon: any, label: string }) {
  return (
    <Link 
      href={href} 
      className="flex flex-col md:flex-row items-center gap-1 md:gap-2 px-3 py-1 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all group"
    >
      <Icon size={20} className="group-hover:scale-110 transition-transform" />
      <span className="text-[10px] md:text-sm font-semibold tracking-wide">{label}</span>
    </Link>
  );
}
