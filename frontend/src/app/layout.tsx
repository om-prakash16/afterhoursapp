import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "Aura | Your AI Companion",
  description: "A secure and empathetic AI companion that remembers and grows with you.",
};

import { AuthProvider } from "@/components/auth/AuthProvider";
import MobileNav from "@/components/MobileNav";
import DemoModeOverlay from "@/components/dashboard/DemoMode";
import CooldownOverlay from "@/components/ui/CooldownOverlay";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} h-full`}>
      <body className="font-inter bg-[#020617] min-h-full flex flex-col text-slate-200">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <MobileNav />
          <DemoModeOverlay />
          <CooldownOverlay />
        </AuthProvider>
      </body>
    </html>
  );
}
