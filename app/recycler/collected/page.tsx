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
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-white">Collected Inventory Register</h2>
        <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-semibold">Log of all secure e-waste sales processed and cleared</p>
      </div>

      <div className="glassmorphism rounded-3xl p-6 border border-white/5 bg-slate-950/20">
        
        {collectedList.length > 0 ? (
          <div className="space-y-4">
            {collectedList.map((item) => (
              <div
                key={item.id}
                className="glassmorphism bg-slate-950/80 rounded-2xl p-5 border border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all hover:border-emerald-500/20"
              >
                {/* Left info */}
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase ${
                      item.valuation.canBeRefurbished
                        ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                        : "bg-amber-500/10 border border-amber-500/20 text-amber-400"
                    }`}>
                      {item.valuation.canBeRefurbished ? "Diverted to Refurbish" : "Direct Material Melting"}
                    </span>
                    <span className="text-[10px] text-gray-500 font-mono font-bold uppercase">Order ID: {item.id}</span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-white mt-2 leading-none">{item.deviceName}</h3>
                  
                  <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2.5 text-[11px] text-gray-400 font-medium">
                    <div className="flex items-center gap-1">
                      <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Seller: {item.userName} ({item.userPhone})</span>
                    </div>
                    <div>•</div>
                    <div>Collected on {item.date}</div>
                  </div>
                </div>

                {/* Right info */}
                <div className="flex items-center gap-6 shrink-0 w-full md:w-auto justify-between md:justify-end border-t border-white/5 md:border-t-0 pt-4 md:pt-0">
                  {/* Metal recovery estimations */}
                  <div className="hidden sm:block text-right">
                    <div className="text-[9px] text-gray-500 font-bold uppercase">Urban Mining Yield</div>
                    <div className="text-xs font-bold text-gray-300 mt-1">
                      Gold: {item.valuation.miningYield.gold}g • Copper: {item.valuation.miningYield.copper}g
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-[9px] text-gray-500 font-bold uppercase">Payout Disbursed</div>
                    <div className="text-base font-extrabold text-emerald-400 mt-1">₹{item.price.toLocaleString()}</div>
                  </div>

                  <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Cleared</span>
                  </div>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 flex flex-col items-center justify-center">
            <Archive className="w-12 h-12 text-emerald-500/40 animate-bounce mb-3" />
            <h3 className="text-lg font-bold text-white leading-snug">No Items Logged</h3>
            <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">
              Any pending pickups you accept and complete on the "Orders Waiting" page will automatically log in this permanent ledger.
            </p>
          </div>
        )}

      </div>

    </div>
  );
}
