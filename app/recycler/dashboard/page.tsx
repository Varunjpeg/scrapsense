"use client";

import React from "react";
import { 
  TrendingUp, Inbox, Archive, CheckCircle, Award, Leaf, Compass, Star, DollarSign
} from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function RecyclerDashboard() {
  const { recycler, bookings } = useApp();

  const totalCollected = bookings.filter(b => b.status === "completed" && b.recyclerId === recycler?.id);
  const totalEarnings = totalCollected.reduce((sum, b) => sum + b.price, 0);
  const pendingOrders = bookings.filter(b => b.recyclerId === recycler?.id && (b.status === "pending" || b.status === "accepted" || b.status === "out_for_pickup"));

  // Mock Monthly Revenue chart data
  const monthlyRevenue = [
    { month: "Jan", rev: 45000 },
    { month: "Feb", rev: 68000 },
    { month: "Mar", rev: 89000 },
    { month: "Apr", rev: 72000 },
    { month: "May", rev: totalEarnings + 35000 }, // Dynamically syncs with collected e-waste!
  ];

  // Maximum value for SVG scaling
  const maxRevenue = Math.max(...monthlyRevenue.map(m => m.rev));

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Slogan banner */}
      <div className="glassmorphism rounded-3xl p-6.5 border border-emerald-500/20 bg-gradient-to-r from-slate-950 via-emerald-950/20 to-slate-950 relative overflow-hidden flex flex-col sm:flex-row justify-between items-center gap-6 shadow-xl">
        <div className="absolute inset-0 eco-grid pointer-events-none opacity-25" />
        
        <div className="relative z-10 space-y-2 text-center sm:text-left">
          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Partner Workspace
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-2 leading-none">
            {recycler?.businessName} Operations
          </h2>
          <p className="text-xs text-gray-400 leading-relaxed pt-1">
            Running certified diagnostics under e-waste Board License <span className="text-emerald-400 font-bold">{recycler?.licenseNumber}</span>.
          </p>
        </div>

        <div className="glassmorphism bg-slate-950/80 rounded-2xl p-4.5 border border-white/5 flex items-center gap-4 text-left shrink-0 z-10 w-full sm:w-auto">
          <div className="p-3.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 animate-pulse">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">Monthly Payouts</div>
            <div className="text-base font-extrabold text-white">₹{totalEarnings.toLocaleString()}</div>
            <p className="text-[10px] text-gray-400 font-medium mt-0.5">{totalCollected.length} successful items processed</p>
          </div>
        </div>
      </div>

      {/* CORE FOUR-METRIC CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="glassmorphism rounded-2xl p-5 border border-white/5">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">Pending Pickups</div>
              <div className="text-2xl font-black text-white mt-2">{pendingOrders.length}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Inbox className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[10px] text-cyan-400 font-semibold mt-4">Bookings awaiting action</p>
        </div>

        <div className="glassmorphism rounded-2xl p-5 border border-white/5">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">Processed Inventory</div>
              <div className="text-2xl font-black text-white mt-2">{totalCollected.length}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Archive className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[10px] text-emerald-400 font-semibold mt-4">Total collections cleared</p>
        </div>

        <div className="glassmorphism rounded-2xl p-5 border border-white/5">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">Total Revenue</div>
              <div className="text-2xl font-black text-white mt-2">₹{totalEarnings.toLocaleString()}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[10px] text-amber-400 font-semibold mt-4">Lifetime payout values</p>
        </div>

        <div className="glassmorphism rounded-2xl p-5 border border-white/5">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">Collector Level</div>
              <div className="text-2xl font-black text-white mt-2">{recycler?.points} PTS</div>
            </div>
            <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[10px] text-indigo-400 font-semibold mt-4">Level +3 Points per collection</p>
        </div>

      </div>

      {/* GRAPHICS & HEATMAP ANALYSIS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Custom SVG Revenue Bar Chart */}
        <div className="lg:col-span-2 glassmorphism rounded-3xl p-6 border border-white/5 bg-slate-950/20 relative">
          <div className="absolute inset-0 eco-grid pointer-events-none opacity-20" />
          <h3 className="text-sm font-black text-white uppercase tracking-wider relative z-10 mb-8">E-waste Revenue Growth (2026)</h3>
          
          {/* Custom SVG */}
          <div className="relative z-10 h-64 flex items-end justify-between px-4 pb-8 pt-4">
            {monthlyRevenue.map((item, index) => {
              // Calculate percentage height
              const heightPct = (item.rev / maxRevenue) * 80; // max height is 80% of chart
              return (
                <div key={index} className="flex flex-col items-center gap-3 w-1/5 group">
                  
                  {/* Glowing value tooltip */}
                  <div className="text-[9px] font-mono text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                    ₹{item.rev.toLocaleString()}
                  </div>

                  {/* Vertical bar */}
                  <div 
                    style={{ height: `${heightPct}%` }}
                    className="w-8 rounded-t-xl bg-gradient-to-t from-slate-950 to-emerald-500 border border-emerald-500/20 hover:border-emerald-400 shadow-lg shadow-emerald-500/5 hover:shadow-emerald-500/15 hover:scale-102 transition-all duration-300 relative"
                  />
                  
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{item.month}</span>
                </div>
              );
            })}
          </div>

          <div className="border-t border-white/5 mt-4 pt-4 flex justify-between text-[9px] text-gray-500 font-mono">
            <span>YTD METRICS: Syncing live collections</span>
            <span>GRID SCALE: Linear auto-zoom</span>
          </div>
        </div>

        {/* Region Collection Heatmap */}
        <div className="glassmorphism rounded-3xl p-6 border border-white/5 bg-slate-950/20 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-wider mb-4">Collection Heatmap</h3>
            <p className="text-[10px] text-gray-400 leading-normal">
              Live tracking e-waste dispatch rates in New Delhi regions.
            </p>

            <div className="space-y-3 mt-6">
              {[
                { name: "Okhla Phase 3", val: 82, color: "bg-emerald-500" },
                { name: "Janakpuri West", val: 48, color: "bg-cyan-500" },
                { name: "South Ext Part 2", val: 94, color: "bg-rose-500" },
                { name: "Connaught Place", val: 65, color: "bg-amber-500" }
              ].map(reg => (
                <div key={reg.name} className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-bold text-gray-300">
                    <span>{reg.name}</span>
                    <span>{reg.val}% Density</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-white/5">
                    <div style={{ width: `${reg.val}%` }} className={`h-full rounded-full ${reg.color}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-[9px] text-gray-500 font-mono text-center pt-4 border-t border-white/5 uppercase">
            Map bounds: latitude coordinate grid Delhi
          </div>
        </div>

      </div>

    </div>
  );
}
