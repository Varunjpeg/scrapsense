"use client";

import React from "react";
import { Archive, ShieldCheck, CheckCircle, Navigation, Award, DollarSign } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function CollectedInventory() {
  const { recycler, bookings } = useApp();

  // Completed items booked with this specific recycler!
  const collectedList = bookings.filter(
    (b) => b.status === "completed" && b.recyclerId === recycler?.id
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto text-left">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-foreground">Collected Inventory Register</h2>
        <p className="text-xs text-muted-text mt-1 uppercase tracking-wider font-semibold">Log of all secure e-waste sales processed and cleared</p>
      </div>

      <div className="space-y-4">
        
        {collectedList.length > 0 ? (
          <div className="space-y-4">
            {collectedList.map((item) => (
              <div
                key={item.id}
                className="glassmorphism bg-card rounded-2xl p-5 border border-card-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all hover:shadow-md"
              >
                {/* Left info */}
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase border ${
                      item.valuation.canBeRefurbished
                        ? "bg-emerald-500/10 border-emerald-500/20 text-accent"
                        : "bg-amber-500/10 border-amber-500/20 text-amber-600"
                    }`}>
                      {item.valuation.canBeRefurbished ? "Diverted to Refurbish" : "Direct Material Melting"}
                    </span>
                    <span className="text-[10px] text-muted-text font-mono font-bold uppercase">Order ID: {item.id}</span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-foreground mt-2 leading-none">{item.deviceName}</h3>
                  
                  <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2.5 text-[11px] text-muted-text font-medium">
                    <div className="flex items-center gap-1">
                      <Navigation className="w-3.5 h-3.5 text-accent" />
                      <span className="text-foreground">Seller: <span className="font-bold">{item.userName}</span> ({item.userPhone})</span>
                    </div>
                    <div className="text-card-border font-extrabold">•</div>
                    <div>Collected on {item.date}</div>
                  </div>
                </div>

                {/* Right info */}
                <div className="flex items-center gap-6 shrink-0 w-full md:w-auto justify-between md:justify-end border-t border-card-border md:border-t-0 pt-4 md:pt-0">
                  {/* Metal recovery estimations */}
                  <div className="hidden sm:block text-right">
                    <div className="text-[9px] text-muted-text font-bold uppercase tracking-wider font-mono">Urban Mining Yield</div>
                    <div className="text-xs font-bold text-foreground mt-1">
                      Gold: {item.valuation.miningYield.gold}g • Copper: {item.valuation.miningYield.copper}g
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-[9px] text-muted-text font-bold uppercase tracking-wider font-mono">Payout Disbursed</div>
                    <div className="text-base font-extrabold text-accent mt-1">₹{item.price.toLocaleString()}</div>
                  </div>

                  <div className="bg-emerald-500/10 border border-emerald-500/20 text-accent px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Cleared</span>
                  </div>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="glassmorphism p-16 text-center bg-card border border-card-border flex flex-col items-center justify-center">
            <Archive className="w-12 h-12 text-accent/30 animate-bounce mb-3" />
            <h3 className="text-base font-bold text-foreground">No Items Logged</h3>
            <p className="text-xs text-muted-text mt-1.5 max-w-xs mx-auto leading-relaxed font-medium">
              Any pending pickups you accept and complete on the "Orders Waiting" page will automatically log in this permanent ledger.
            </p>
          </div>
        )}

      </div>

    </div>
  );
}
