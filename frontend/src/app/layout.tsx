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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} h-full`}>
      <body className="font-inter bg-slate-50 min-h-full flex flex-col">
        <Navbar />
        <main className="flex-1 pb-20 md:pb-0 md:pt-20">
          {children}
        </main>
      </body>
    </html>
  );
}
