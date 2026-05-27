"use client";

import React from "react";
import { TrendingUp, Inbox, Archive, Award, DollarSign, Leaf } from "lucide-react";
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
    { month: "May", rev: totalEarnings + 18000 }, // dynamically calculated
  ];

  // Maximum value for SVG scaling
  const maxRevenue = Math.max(...monthlyRevenue.map(m => m.rev));

  return (
    <div className="space-y-6 max-w-5xl mx-auto text-left">
      
      {/* Slogan banner */}
      <div className="glassmorphism rounded-xl p-5.5 border border-card-border bg-card relative overflow-hidden flex flex-col sm:flex-row justify-between items-center gap-5 shadow-sm">
        <div className="absolute inset-0 eco-grid pointer-events-none opacity-20" />
        
        <div className="relative z-10 space-y-1.5 text-center sm:text-left">
          <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[9px] font-bold px-2 py-0.5 rounded font-mono uppercase">
            Partner Workspace
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-foreground mt-2 leading-none">
            {recycler?.businessName} Operations
          </h2>
          <p className="text-xs text-muted-text leading-relaxed">
            CPCB Authorized diagnostics under e-waste Board License <span className="text-emerald-500 font-bold font-mono text-[11px]">{recycler?.licenseNumber}</span>.
          </p>
        </div>

        <div className="glassmorphism bg-background rounded-xl p-4 border border-card-border flex items-center gap-3.5 text-left shrink-0 z-10 w-full sm:w-auto shadow-inner">
          <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 animate-pulse">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[9px] text-muted-text font-bold uppercase tracking-wider font-mono">Monthly cleared worth</div>
            <div className="text-sm font-extrabold text-foreground mt-0.5">₹{totalEarnings.toLocaleString()}</div>
            <p className="text-[10px] text-muted-text font-medium mt-0.5">{totalCollected.length} successful items processed</p>
          </div>
        </div>
      </div>

      {/* FOUR-METRIC CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div className="glassmorphism rounded-xl p-4.5 border border-card-border bg-card">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-[10px] text-muted-text font-bold uppercase tracking-wider font-mono">Pending Pickups</div>
              <div className="text-xl font-black text-foreground mt-1.5">{pendingOrders.length}</div>
            </div>
            <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
              <Inbox className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[9px] text-muted-text font-bold uppercase mt-3.5">Bookings awaiting action</p>
        </div>

        <div className="glassmorphism rounded-xl p-4.5 border border-card-border bg-card">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-[10px] text-muted-text font-bold uppercase tracking-wider font-mono">Cleared ledger</div>
              <div className="text-xl font-black text-foreground mt-1.5">{totalCollected.length}</div>
            </div>
            <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
              <Archive className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[9px] text-muted-text font-bold uppercase mt-3.5">Total collections processed</p>
        </div>

        <div className="glassmorphism rounded-xl p-4.5 border border-card-border bg-card">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-[10px] text-muted-text font-bold uppercase tracking-wider font-mono">Total Revenue</div>
              <div className="text-xl font-black text-foreground mt-1.5">₹{totalEarnings.toLocaleString()}</div>
            </div>
            <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[9px] text-muted-text font-bold uppercase mt-3.5">Lifetime cleared worth</p>
        </div>

        <div className="glassmorphism rounded-xl p-4.5 border border-card-border bg-card">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-[10px] text-muted-text font-bold uppercase tracking-wider font-mono">Partner points</div>
              <div className="text-xl font-black text-foreground mt-1.5">{recycler?.points} PTS</div>
            </div>
            <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[9px] text-muted-text font-bold uppercase mt-3.5">Level +3 PTS per pickup</p>
        </div>

      </div>

      {/* GRAPHICS & HEATMAP */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6.5">
        
        {/* Custom SVG Revenue Bar Chart */}
        <div className="lg:col-span-2 glassmorphism rounded-xl p-5 border border-card-border bg-card relative">
          <div className="absolute inset-0 eco-grid pointer-events-none opacity-20" />
          <h3 className="text-xs font-black text-foreground uppercase tracking-wider font-mono relative z-10 mb-6">E-waste Revenue Growth (2026)</h3>
          
          <div className="relative z-10 h-56 flex items-end justify-between px-3 pb-8 pt-3 border-b border-card-border">
            {monthlyRevenue.map((item, index) => {
              const heightPct = (item.rev / maxRevenue) * 80; // max height 80%
              return (
                <div key={index} className="flex flex-col items-center gap-2.5 w-1/5 group">
                  <div className="text-[9px] font-mono text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                    ₹{item.rev.toLocaleString()}
                  </div>

                  <div 
                    style={{ height: `${heightPct}%` }}
                    className="w-7 rounded-t bg-gradient-to-t from-background to-emerald-500 border border-emerald-500/20 hover:border-emerald-500/50 shadow-sm transition-all duration-300 relative"
                  />
                  
                  <span className="text-[9px] text-muted-text font-bold uppercase tracking-wider font-mono">{item.month}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-3.5 flex justify-between text-[8px] text-muted-text font-mono font-bold uppercase">
            <span>YTD METRICS: Syncing verified pickup totals</span>
            <span>SCALE: Linear Auto-Zoom</span>
          </div>
        </div>

        {/* Region Collection Heatmap */}
        <div className="glassmorphism rounded-xl p-5 border border-card-border bg-card flex flex-col justify-between h-[320px]">
          <div>
            <h3 className="text-xs font-black text-foreground uppercase tracking-wider font-mono mb-3">Collection Heatmap</h3>
            <p className="text-[10px] text-muted-text leading-normal">
              Diverting active e-waste densities inside Delhi zones.
            </p>

            <div className="space-y-3.5 mt-5">
              {[
                { name: "Okhla Industrial Area", val: 82, color: "bg-emerald-500" },
                { name: "Janakpuri District Center", val: 48, color: "bg-emerald-500/50" },
                { name: "South Ext Part II", val: 94, color: "bg-emerald-500" },
                { name: "Connaught Place", val: 65, color: "bg-emerald-500/70" }
              ].map(reg => (
                <div key={reg.name} className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold text-foreground font-mono uppercase">
                    <span>{reg.name}</span>
                    <span>{reg.val}% Density</span>
                  </div>
                  <div className="w-full h-1 bg-background rounded-full overflow-hidden border border-card-border">
                    <div style={{ width: `${reg.val}%` }} className={`h-full rounded-full ${reg.color}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-[8px] text-muted-text font-mono text-center pt-3 border-t border-card-border uppercase font-bold">
            Delhi coordinate grid metrics
          </div>
        </div>

      </div>

    </div>
  );
}
