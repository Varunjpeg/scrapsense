"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Leaf, Shield, Cpu, Zap, HeartHandshake, Compass } from "lucide-react";
import Marquee from "@/components/Marquee";
import StatsCounter from "@/components/StatsCounter";

export default function LandingPage() {
  return (
    <div className="flex flex-col flex-1 bg-background text-foreground relative overflow-hidden font-sans min-h-screen">
      {/* Subtly repeating engineering grid for minor eco-tech highlights */}
      <div className="absolute inset-0 eco-grid pointer-events-none opacity-40 z-0" />
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full bg-emerald-500/5 blur-3xl pointer-events-none z-0" />

      {/* HEADER SECTION */}
      <header className="relative z-10 w-full max-w-5xl mx-auto px-6 py-4 flex items-center justify-between border-b border-card-border bg-card/60 backdrop-blur-md rounded-full mt-4 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shadow-sm">
            <Leaf className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <span className="text-base font-extrabold tracking-tight text-foreground">Scrap<span className="text-emerald-500">Sense</span></span>
            <span className="bg-emerald-500/10 text-emerald-600 text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ml-2 border border-emerald-500/20 font-mono">
              CPCB Certified
            </span>
          </div>
        </div>

        <nav className="flex items-center gap-5">
          <Link
            href="/auth/login"
            className="text-xs font-bold text-muted-text hover:text-foreground transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/auth/signup"
            className="px-4.5 py-2.5 rounded-full btn-green-gradient text-xs font-bold shadow"
          >
            Start Recycling
          </Link>
        </nav>
      </header>

      {/* HERO SECTION */}
      <main className="flex-1 flex flex-col items-center justify-center relative z-10 pt-16 pb-20 text-center px-4">
        
        {/* Subtle, premium category label */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/5 border border-emerald-500/15 text-emerald-600 text-[9px] font-bold uppercase tracking-widest mb-6 select-none font-mono">
          <Zap className="w-3.5 h-3.5 text-emerald-500" />
          <span>India's Smartest AI-Powered E-Waste Platform</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground max-w-3xl leading-tight">
          Recycle Old Electronics <br />
          For <span className="bg-gradient-to-r from-emerald-600 to-emerald-400 bg-clip-text text-transparent">Eco-Credits & Cash</span>
        </h1>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm text-muted-text mt-4 max-w-lg leading-relaxed font-medium">
          Divert old devices from landfills using Google Gemini Flash Vision. Check locked market scrap worth, book doorstep pickups, and track CO₂ saves permanently in SQLite database!
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3.5 mt-8 w-full sm:w-auto px-6">
          <Link
            href="/auth/login"
            className="flex items-center justify-center gap-2 py-3 px-6 rounded-xl btn-green-gradient font-black transition-all shadow cursor-pointer text-xs"
          >
            <span>Launch User Portal</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/auth/signup?role=recycler"
            className="flex items-center justify-center gap-2 py-3 px-6 rounded-xl border border-card-border hover:border-emerald-500/20 text-foreground hover:text-emerald-500 font-bold transition-all bg-card shadow-sm cursor-pointer text-xs"
          >
            <span>Partner Recycler Workspace</span>
            <HeartHandshake className="w-4 h-4 text-emerald-500 animate-pulse" />
          </Link>
        </div>

        {/* Real-time counters widgets */}
        <StatsCounter />

      </main>

      {/* INFINITE FACT MARQUEE */}
      <Marquee />

      {/* THREE-COLUMN VALUE PROP SECTION */}
      <section className="relative z-10 w-full max-w-5xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-5">
        
        <div className="glassmorphism p-5 rounded-xl border border-card-border bg-card shadow-sm hover:shadow-md transition-shadow text-left">
          <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 w-fit mb-3.5 shadow-sm">
            <Cpu className="w-5 h-5 animate-pulse" />
          </div>
          <h3 className="text-xs font-black text-foreground uppercase tracking-wider font-mono">Gemini Vision AI</h3>
          <p className="text-xs text-muted-text mt-1.5 leading-relaxed font-medium">
            Google Gemini Vision evaluates device physical conditions to calculate metal scrap weights and locked cash values instantly.
          </p>
        </div>

        <div className="glassmorphism p-5 rounded-xl border border-card-border bg-card shadow-sm hover:shadow-md transition-shadow text-left">
          <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 w-fit mb-3.5 shadow-sm">
            <Compass className="w-5 h-5 animate-spin-slow" />
          </div>
          <h3 className="text-xs font-black text-foreground uppercase tracking-wider font-mono">OSM Geolocation</h3>
          <p className="text-xs text-muted-text mt-1.5 leading-relaxed font-medium">
            Ditch hardcoded lists. Real-time OpenStreetMap Nominatim APIs resolve coordinates and lookup actual scrap dealers inside any city.
          </p>
        </div>

        <div className="glassmorphism p-5 rounded-xl border border-card-border bg-card shadow-sm hover:shadow-md transition-shadow text-left">
          <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 w-fit mb-3.5 shadow-sm">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="text-xs font-black text-foreground uppercase tracking-wider font-mono">Relational SQLite DB</h3>
          <p className="text-xs text-muted-text mt-1.5 leading-relaxed font-medium">
            Full SQL-equivalent database engine managing secure OTP signups, hashed credentials, permanent profiles, and collection histories.
          </p>
        </div>

      </section>

      {/* FOOTER */}
      <footer className="relative z-10 w-full border-t border-card-border py-6 text-center text-[10px] text-muted-text font-bold uppercase font-mono tracking-wider bg-card/45">
        <p>© 2026 ScrapSense India Pvt Ltd. CPCB authorized e-waste aggregator.</p>
      </footer>
    </div>
  );
}
