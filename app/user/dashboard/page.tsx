"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight, ShieldCheck, Cpu, MapPin, Wrench, BadgeDollarSign, User, Sparkles, Award, Navigation
} from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function UserDashboard() {
  const { user, dealers, refurbishers, bookings } = useApp();

  const activeBookings = bookings.filter(b => b.status === "pending" || b.status === "accepted" || b.status === "out_for_pickup");

  const cards = [
    {
      title: "Get Exact Amount",
      desc: "Calculate gold yields and secure cash valuations with Google Gemini.",
      href: "/user/valuation",
      icon: BadgeDollarSign,
      color: "hover:border-emerald-500/30",
      iconColor: "text-emerald-500 border-emerald-500/20 bg-emerald-500/5",
      badge: "AI Gemini"
    },
    {
      title: "Search Scrap Dealers",
      desc: "Find nearest certified e-waste scrap dealers with interactive radar maps.",
      href: "/user/dealers",
      icon: MapPin,
      color: "hover:border-emerald-500/30",
      iconColor: "text-emerald-500 border-emerald-500/20 bg-emerald-500/5"
    },
    {
      title: "Search Refurbishers",
      desc: "Connect with certified micro-soldering logic board repair centers.",
      href: "/user/refurbishers",
      icon: Wrench,
      color: "hover:border-emerald-500/30",
      iconColor: "text-emerald-500 border-emerald-500/20 bg-emerald-500/5"
    },
    {
      title: "Environmental Profile",
      desc: "Track wallet cash payouts, Carbon Leaderboard standings, and badges.",
      href: "/user/profile",
      icon: User,
      color: "hover:border-emerald-500/30",
      iconColor: "text-emerald-500 border-emerald-500/20 bg-emerald-500/5"
    }
  ];

  return (
    <div className="space-y-6.5 max-w-5xl mx-auto">

      {/* Stripe-style Profile Hero Banner */}
      <div className="glassmorphism rounded-xl p-5.5 border border-card-border bg-card relative overflow-hidden flex flex-col sm:flex-row justify-between items-center gap-5 shadow-sm">
        <div className="absolute inset-0 eco-grid pointer-events-none opacity-20" />
        <div className="relative z-10 space-y-1.5 text-center sm:text-left">
          <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[9px] font-bold px-2 py-0.5 rounded font-mono uppercase">
            User Workspace
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-foreground mt-2 leading-none">
            Welcome back, {user?.name}
          </h2>
          <p className="text-xs text-muted-text leading-relaxed">
            Your e-waste diversion activities have saved approximately <span className="text-emerald-500 font-bold">{(user?.rewardPoints || 0) * 12} kg</span> of structural greenhouse gases.
          </p>
        </div>

        {/* Level metrics */}
        <div className="glassmorphism bg-background rounded-xl p-4 border border-card-border flex items-center gap-3.5 text-left shrink-0 z-10 w-full sm:w-auto shadow-inner">
          <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[9px] text-muted-text font-bold uppercase tracking-wider font-mono">Rank standing</div>
            <div className="text-sm font-extrabold text-foreground mt-0.5">Eco Saver Tier 1</div>
            <p className="text-[10px] text-emerald-500 font-medium mt-0.5">{user?.rewardPoints} points accumulated</p>
          </div>
        </div>
      </div>

      {/* PORTAL NAVIGATION CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5.5">
        {cards.map(card => {
          const CardIcon = card.icon;
          return (
            <Link
              key={card.href}
              href={card.href}
              className={`glassmorphism rounded-xl p-5.5 bg-card border border-card-border glassmorphism-hover relative group flex flex-col justify-between min-h-[140px] cursor-pointer`}
            >
              {card.badge && (
                <span className="absolute top-4 right-4 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[8px] font-bold px-2 py-0.5 rounded uppercase font-mono">
                  {card.badge}
                </span>
              )}
              <div className="flex items-start gap-3.5">
                <div className={`p-2.5 rounded-xl border ${card.iconColor} shrink-0 shadow-sm`}>
                  <CardIcon className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-foreground group-hover:text-emerald-500 transition-colors leading-tight">
                    {card.title}
                  </h3>
                  <p className="text-xs text-muted-text leading-normal max-w-[270px]">
                    {card.desc}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 text-[11px] font-bold text-foreground mt-4 group-hover:text-emerald-500 transition-colors">
                <span>Access workspace</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* ACTIVE SCHEDULED DISPATCHES */}
      {activeBookings.length > 0 && (
        <div className="glassmorphism rounded-xl p-5 border border-card-border bg-card">
          <div className="flex items-center gap-2 mb-4.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="text-[10px] font-black text-foreground uppercase tracking-wider font-mono">Active Pickups In Progress ({activeBookings.length})</h3>
          </div>

          <div className="space-y-3">
            {activeBookings.map(b => (
              <div key={b.id} className="glassmorphism bg-background rounded-xl p-3.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border border-card-border">
                <div>
                  <div className="text-[9px] text-muted-text font-bold uppercase tracking-wider font-mono">Order ID: {b.id}</div>
                  <h4 className="text-xs font-bold text-foreground mt-1">{b.deviceName} • Payout: ₹{b.price.toLocaleString()}</h4>
                  <p className="text-[10px] text-muted-text mt-0.5">Dealer: {b.recyclerName} | Slot: {b.timeSlot}</p>
                </div>

                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[8px] font-bold uppercase border ${b.status === "pending"
                  ? "bg-muted-border border-card-border text-muted-text"
                  : "bg-emerald-500/10 border-emerald-500/20 text-emerald-500 animate-pulse"
                  }`}>
                  {b.status === "pending" ? "Awaiting pickup" : b.status === "accepted" ? "Booking Confirmed" : "Agent dispatched"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FEATURED PARTNERS */}
      <div className="space-y-3.5">
        <div className="flex justify-between items-center">
          <h3 className="text-[10px] font-black text-foreground uppercase tracking-wider font-mono">Verified Nearby Partners</h3>
          <Link href="/user/dealers" className="text-xs font-bold text-emerald-500 hover:underline">
            View Map Registry
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5.5">
          {dealers.slice(0, 3).map(dealer => (
            <div key={dealer.id} className="glassmorphism rounded-xl p-4.5 border border-card-border bg-card flex flex-col justify-between group">
              <div>
                <div className="flex justify-between items-start">
                  <h4 className="text-xs font-bold text-foreground group-hover:text-emerald-500 transition-colors leading-tight">
                    {dealer.businessName}
                  </h4>
                  <div className="flex items-center gap-0.5 bg-amber-400/10 border border-amber-400/20 text-[9px] font-bold text-amber-500 px-1 py-0.5 rounded">
                    <span>★</span>
                    <span>{dealer.ratings}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-muted-text mt-2 font-medium">
                  <Navigation className="w-3 h-3 text-emerald-500 shrink-0" />
                  <span className="truncate">{dealer.distance} away • {dealer.address}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mt-3.5">
                {(dealer.services || []).slice(0, 2).map((serv, i) => (
                  <span key={i} className="text-[8px] bg-background border border-card-border text-muted-text px-2 py-0.5 rounded font-medium">
                    {serv}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
