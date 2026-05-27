"use client";

import Link from "next/link";
import { 
  ArrowRight, ShieldCheck, Cpu, MapPin, Wrench, BadgeDollarSign, User, Sparkles, Award, Navigation
} from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function UserDashboard() {
  const { user, dealers, refurbishers, bookings } = useApp();

  const activeBookings = bookings.filter(b => b.status === "pending" || b.status === "accepted" || b.status === "out_for_pickup");
  const completedBookings = bookings.filter(b => b.status === "completed");

  const cards = [
    {
      title: "Get Exact Amount",
      desc: "Instant AI diagnostics & urban mining yield predictions.",
      href: "/user/valuation",
      icon: BadgeDollarSign,
      color: "from-emerald-500/20 to-teal-500/5 hover:border-emerald-500/30",
      iconColor: "text-emerald-400 border-emerald-500/20 bg-emerald-500/10",
      badge: "AI Powered"
    },
    {
      title: "Search Scrap Dealers",
      desc: "Find nearest certified dealers with interactive radar maps.",
      href: "/user/dealers",
      icon: MapPin,
      color: "from-cyan-500/20 to-slate-500/5 hover:border-cyan-500/30",
      iconColor: "text-cyan-400 border-cyan-500/20 bg-cyan-500/10"
    },
    {
      title: "Search Refurbishers",
      desc: "Connect with board-level repair specialists & upgrade hubs.",
      href: "/user/refurbishers",
      icon: Wrench,
      color: "from-amber-500/20 to-orange-500/5 hover:border-amber-500/30",
      iconColor: "text-amber-400 border-amber-500/20 bg-amber-500/10"
    },
    {
      title: "Environmental Profile",
      desc: "Track wallet balances, environmental scorecards, and badges.",
      href: "/user/profile",
      icon: User,
      color: "from-indigo-500/20 to-purple-500/5 hover:border-indigo-500/30",
      iconColor: "text-indigo-400 border-indigo-500/20 bg-indigo-500/10"
    }
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Dynamic Slogan Hero Banner */}
      <div className="glassmorphism rounded-3xl p-6.5 border border-emerald-500/20 bg-gradient-to-r from-slate-950 via-emerald-950/20 to-slate-950 relative overflow-hidden flex flex-col sm:flex-row justify-between items-center gap-6 shadow-xl">
        {/* Glow grid background */}
        <div className="absolute inset-0 eco-grid pointer-events-none opacity-25" />
        <div className="relative z-10 space-y-2 max-w-xl text-center sm:text-left">
          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Green-Tech Dashboard
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-2 leading-none">
            Welcome back, <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">{user?.name}</span>!
          </h2>
          <p className="text-xs text-gray-400 leading-relaxed pt-1">
            You have diverted <span className="text-emerald-400 font-bold">{(user?.rewardPoints || 0) * 12} kg</span> of CO₂ emissions from landfills. Let's recycle more old hardware today!
          </p>
        </div>

        {/* Dynamic environmental level widget */}
        <div className="glassmorphism bg-slate-950/80 rounded-2xl p-4.5 border border-white/5 flex items-center gap-4 text-left shrink-0 z-10 w-full sm:w-auto">
          <div className="p-3.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-400/20 animate-pulse">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">Active Level</div>
            <div className="text-base font-extrabold text-white">Eco Saver Tier 1</div>
            <p className="text-[10px] text-emerald-400 font-medium mt-0.5">{user?.rewardPoints} points accumulated</p>
          </div>
        </div>
      </div>

      {/* PORTAL NAVIGATION CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map(card => {
          const CardIcon = card.icon;
          return (
            <Link
              key={card.href}
              href={card.href}
              className={`glassmorphism rounded-3xl p-6.5 bg-gradient-to-br ${card.color} border border-white/5 glassmorphism-hover relative group flex flex-col justify-between min-h-[160px] cursor-pointer`}
            >
              {card.badge && (
                <span className="absolute top-4 right-4 bg-emerald-500 text-slate-950 text-[8px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider shadow">
                  {card.badge}
                </span>
              )}
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl border ${card.iconColor} shrink-0`}>
                  <CardIcon className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors leading-tight">
                    {card.title}
                  </h3>
                  <p className="text-xs text-gray-400 leading-normal max-w-[280px]">
                    {card.desc}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-bold text-white mt-4 group-hover:text-emerald-400 transition-colors">
                <span>Open Portal</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* RECENT BOOKINGS & LIVE TRACKING SEGMENT */}
      {activeBookings.length > 0 && (
        <div className="glassmorphism rounded-3xl p-6 border border-cyan-500/20 bg-slate-950/20">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <h3 className="text-sm font-black text-white uppercase tracking-wider">Active Pickup Operations ({activeBookings.length})</h3>
          </div>

          <div className="space-y-4">
            {activeBookings.map(b => (
              <div key={b.id} className="glassmorphism bg-slate-950/80 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border border-white/5">
                <div>
                  <div className="text-xs text-gray-500 font-bold uppercase tracking-wider font-mono">Order ID: {b.id}</div>
                  <h4 className="text-sm font-bold text-white mt-1">{b.deviceName} • ₹{b.price.toLocaleString()}</h4>
                  <p className="text-[11px] text-gray-400 mt-0.5">Recycler: {b.recyclerName} | Slot: {b.timeSlot}</p>
                </div>

                {/* Status Indicator */}
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${
                      b.status === "pending" 
                        ? "bg-slate-900 border-white/5 text-gray-400" 
                        : "bg-cyan-500/10 border-cyan-500 text-cyan-400 animate-pulse"
                    }`}>
                      {b.status === "pending" ? "Awaiting Recycler" : b.status === "accepted" ? "Booking Confirmed" : "Agent Out For Pickup"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FEATURED CERTIFIED DEALERS GRID */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-black text-white uppercase tracking-wider">Nearby Certified Recyclers</h3>
          <Link href="/user/dealers" className="text-xs font-bold text-emerald-400 hover:underline">
            View All Dealers
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dealers.slice(0, 3).map(dealer => (
            <div key={dealer.id} className="glassmorphism rounded-2xl p-5 border border-white/5 flex flex-col justify-between group">
              <div>
                <div className="flex justify-between items-start">
                  <h4 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors leading-tight">
                    {dealer.businessName}
                  </h4>
                  <div className="flex items-center gap-0.5 bg-amber-400/10 border border-amber-400/20 text-[10px] font-bold text-amber-400 px-1.5 py-0.5 rounded">
                    <span>★</span>
                    <span>{dealer.ratings}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-gray-400 mt-2 font-medium">
                  <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{dealer.distance} away • {dealer.address}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mt-4">
                {dealer.services.slice(0, 2).map((serv, i) => (
                  <span key={i} className="text-[9px] bg-slate-950 border border-white/5 text-gray-400 px-2 py-0.5 rounded">
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
