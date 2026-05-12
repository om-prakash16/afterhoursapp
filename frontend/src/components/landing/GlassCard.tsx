"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export default function GlassCard({ children, className = "", delay = 0 }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
      className={`glass-morphism rounded-[2rem] p-8 relative overflow-hidden group hover:border-white/20 transition-all duration-500 ${className}`}
    >
      {/* Hover Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 via-indigo-500/0 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Animated Border Beam (Simulated with absolute div) */}
      <div className="absolute -inset-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 animate-pulse" />
    </motion.div>
  );
}
