"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Leaf, Shield, Cpu, Zap, HeartHandshake, Compass } from "lucide-react";
import Marquee from "@/components/Marquee";
import StatsCounter from "@/components/StatsCounter";

export default function LandingPage() {
  return (
    <div className="flex flex-col flex-1 bg-background text-foreground relative overflow-hidden">
      {/* Dynamic Radar grid backdrop */}
      <div className="absolute inset-0 eco-grid pointer-events-none opacity-30 z-0" />
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />

      {/* HEADER SECTION */}
      <header className="relative z-10 w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between border-b border-white/5 bg-slate-950/20 backdrop-blur-md rounded-full mt-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-md shadow-emerald-500/5">
            <Leaf className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="text-lg font-black tracking-tight text-white">Scrap<span className="text-emerald-400">Sense</span></span>
            <span className="hidden sm:inline bg-emerald-500/10 text-emerald-400 text-[8px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ml-2 border border-emerald-500/20">
              AI Powered
            </span>
          </div>
        </div>

        <nav className="flex items-center gap-4">
          <Link
            href="/auth/login"
            className="text-xs font-bold text-gray-300 hover:text-white transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/auth/signup"
            className="px-4.5 py-2 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-emerald-500/15"
          >
            Register Portal
          </Link>
        </nav>
      </header>

      {/* HERO SECTION */}
      <main className="flex-1 flex flex-col items-center justify-center relative z-10 pt-16 pb-24 text-center px-4">
        
        {/* Neon tag */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-extrabold uppercase tracking-widest animate-pulse mb-6">
          <Zap className="w-3 h-3 text-cyan-400 fill-current animate-bounce" />
          <span>India's Smartest AI-Powered E-Waste Ecosystem</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white max-w-4xl leading-none">
          Turn Old Electronics <br />
          Into <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Eco-Credits & Cash</span>
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-lg text-gray-400 mt-6 max-w-2xl leading-relaxed">
          Recycling shouldn't be a chore. Run instant AI-vision scans to calculate exact device value, book free doorstep pickups, and earn premium green offsets today.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 mt-10 w-full sm:w-auto px-6">
          <Link
            href="/auth/login"
            className="flex items-center justify-center gap-2.5 py-4 px-8 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black transition-all shadow-xl shadow-emerald-500/20 hover:scale-102 text-sm cursor-pointer"
          >
            <span>Launch User Portal</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/auth/signup?role=recycler"
            className="flex items-center justify-center gap-2.5 py-4 px-8 rounded-2xl border border-white/10 hover:border-emerald-500/30 text-white hover:text-emerald-400 font-bold transition-all bg-white/5 hover:bg-emerald-500/5 hover:scale-102 text-sm cursor-pointer"
          >
            <span>Partner Recycler Register</span>
            <HeartHandshake className="w-4 h-4 text-emerald-400" />
          </Link>
        </div>

        {/* Real-time counters widgets */}
        <StatsCounter />

      </main>

      {/* INFINITE FACT MARQUEE */}
      <Marquee />

      {/* THREE-COLUMN VALUE PROP SECTION */}
      <section className="relative z-10 w-full max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        <div className="glassmorphism p-6 rounded-2xl border border-white/5">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 w-fit mb-4">
            <Cpu className="w-6 h-6 animate-pulse" />
          </div>
          <h3 className="text-lg font-bold text-white leading-tight">AI-Powered Valuation</h3>
          <p className="text-xs text-gray-400 mt-2 leading-relaxed">
            Our neural classification engines automatically calculate scrap values, refurbishment viability ratios, and urban metal recovery weights in milliseconds.
          </p>
        </div>

        <div className="glassmorphism p-6 rounded-2xl border border-white/5">
          <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 w-fit mb-4">
            <Compass className="w-6 h-6 animate-spin-slow" />
          </div>
          <h3 className="text-lg font-bold text-white leading-tight">Smart Eco-Radar Maps</h3>
          <p className="text-xs text-gray-400 mt-2 leading-relaxed">
            Quickly lookup verified recyclers, read client reviews, and schedule secure doorstep collections with instant call and WhatsApp shortcuts.
          </p>
        </div>

        <div className="glassmorphism p-6 rounded-2xl border border-white/5">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 w-fit mb-4">
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white leading-tight">Gamified Incentives</h3>
          <p className="text-xs text-gray-400 mt-2 leading-relaxed">
            Level up, climb the regional carbon savings leaderboard, and earn rare badges by recycling items. Every successful transaction is securely certified.
          </p>
        </div>

      </section>

      {/* FOOTER */}
      <footer className="relative z-10 w-full border-t border-white/5 py-8 text-center text-xs text-gray-500 font-medium">
        <p>© 2026 ScrapSense Technologies India Pvt Ltd. All rights reserved.</p>
        <p className="mt-1 text-[10px] text-gray-600 uppercase tracking-widest font-mono">India's Smartest AI-Powered E-Waste Ecosystem</p>
      </footer>
    </div>
  );
}
