"use client";

import React from "react";
import { Inbox, Compass, Navigation, Phone, ShieldCheck, Check, X, AlertTriangle, ArrowRight } from "lucide-react";
import { useApp, Booking } from "@/context/AppContext";

export default function OrdersDispatcher() {
  const { recycler, bookings, updateBookingStatus } = useApp();

  // Active bookings synced to this business partner
  const orderQueue = bookings.filter(
    (b) => b.recyclerId === recycler?.id && b.status !== "completed" && b.status !== "rejected"
  );

  const handleAccept = (bookingId: string) => {
    updateBookingStatus(bookingId, "accepted");
  };

  const handleStartPickup = (bookingId: string) => {
    updateBookingStatus(bookingId, "out_for_pickup");
  };

  const handleComplete = (bookingId: string) => {
    updateBookingStatus(bookingId, "completed");
  };

  const handleReject = (bookingId: string) => {
    updateBookingStatus(bookingId, "rejected");
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-white">Pending Pickup Orders Queue</h2>
        <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-semibold">Accept door-step pickup requests and process instant payouts</p>
      </div>

      <div className="glassmorphism rounded-3xl p-6 border border-white/5 bg-slate-950/20">
        
        {orderQueue.length > 0 ? (
          <div className="space-y-6">
            {orderQueue.map((item) => (
              <div
                key={item.id}
                className="glassmorphism bg-slate-950/80 rounded-2xl p-6 border border-white/5 space-y-6 transition-all hover:border-emerald-500/10"
              >
                {/* Meta details row */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/5 pb-4 gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase ${
                        item.valuation.canBeRefurbished
                          ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                          : "bg-amber-500/10 border border-amber-500/20 text-amber-400"
                      }`}>
                        {item.valuation.canBeRefurbished ? "Divert to Repair" : "Divert to Recycling"}
                      </span>
                      <span className="text-[10px] text-gray-500 font-mono font-bold uppercase">Order: #{item.id}</span>
                    </div>
                    
                    <h3 className="text-base font-extrabold text-white mt-1">{item.deviceName}</h3>
                  </div>

                  <div className="text-left md:text-right">
                    <div className="text-[9px] text-gray-500 font-bold uppercase">Locked Payout Value</div>
                    <div className="text-lg font-black text-emerald-400 mt-0.5">₹{item.price.toLocaleString()}</div>
                  </div>
                </div>

                {/* Grid info: specifications & pickup location */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Diagnosis specifications */}
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Device diagnostics reported</h4>
                    <div className="grid grid-cols-2 gap-2 text-[10px] text-gray-300">
                      <div className="bg-slate-950/60 p-2 rounded-lg border border-white/5">
                        <span className="text-gray-500 block">Functional State</span>
                        <span className="font-bold text-white mt-0.5 block">{item.valuation.isFunctional ? "Operational" : "Dead"}</span>
                      </div>
                      <div className="bg-slate-950/60 p-2 rounded-lg border border-white/5">
                        <span className="text-gray-500 block">Physical Age</span>
                        <span className="font-bold text-white mt-0.5 block">{item.valuation.age}</span>
                      </div>
                      <div className="bg-slate-950/60 p-2 rounded-lg border border-white/5">
                        <span className="text-gray-500 block">Screen Panel</span>
                        <span className="font-bold text-white mt-0.5 block">{item.valuation.screenCondition}</span>
                      </div>
                      <div className="bg-slate-950/60 p-2 rounded-lg border border-white/5">
                        <span className="text-gray-500 block">Chassis Outer</span>
                        <span className="font-bold text-white mt-0.5 block">{item.valuation.physicalCondition}</span>
                      </div>
                    </div>
                  </div>

                  {/* Pickup specs */}
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Logistics & address details</h4>
                    <div className="bg-slate-950/60 p-4 rounded-xl border border-white/5 space-y-2.5 text-xs text-gray-300">
                      <div className="flex items-start gap-2">
                        <Navigation className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <div className="font-bold text-white">{item.userName}</div>
                          <div className="text-[10px] text-gray-400 mt-0.5">{item.userAddress}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 border-t border-white/5 pt-2">
                        <Phone className="w-4 h-4 text-emerald-400" />
                        <span>{item.userPhone}</span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Operations dispatcher action controls depending on current status */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-t border-white/5 pt-5">
                  {/* Status track slider */}
                  <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400 select-none">
                    <span className="text-slate-500 uppercase tracking-wider text-[9px] mr-1">Current State:</span>
                    <span className={`px-2 py-0.5 rounded-full uppercase text-[8px] font-black border ${
                      item.status === "pending" 
                        ? "bg-slate-900 border-white/5 text-gray-400"
                        : "bg-cyan-500/10 border-cyan-500 text-cyan-400 animate-pulse"
                    }`}>
                      {item.status === "pending" ? "Awaiting Acceptance" : item.status === "accepted" ? "Agent Confirmed" : "Out For Pickup"}
                    </span>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex gap-3 w-full sm:w-auto">
                    {item.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleReject(item.id)}
                          className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl border border-white/5 hover:border-red-500/30 text-xs font-bold text-red-400 hover:bg-red-500/5 transition-all cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                        <button
                          onClick={() => handleAccept(item.id)}
                          className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 py-2.5 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-all shadow-lg shadow-emerald-500/10 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Accept Pickup</span>
                        </button>
                      </>
                    )}

                    {item.status === "accepted" && (
                      <button
                        onClick={() => handleStartPickup(item.id)}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 py-2.5 px-6 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black transition-all shadow-lg shadow-cyan-500/10 cursor-pointer text-xs"
                      >
                        <span>Dispatch Pick Up Agent</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}

                    {item.status === "out_for_pickup" && (
                      <button
                        onClick={() => handleComplete(item.id)}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 py-3 px-8 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black transition-all shadow-xl shadow-emerald-500/25 cursor-pointer text-xs animate-pulse"
                      >
                        <Check className="w-4 h-4" />
                        <span>Verify Diagnosis & Disburse Payout</span>
                      </button>
                    )}
                  </div>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 flex flex-col items-center justify-center">
            <Inbox className="w-12 h-12 text-emerald-500/40 animate-bounce mb-3" />
            <h3 className="text-lg font-bold text-white leading-snug">Queue is empty</h3>
            <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">
              No pending doorstep e-waste bookings are currently registered. Let's wait for users in your service zone to lock their device valuations.
            </p>
          </div>
        )}

      </div>

    </div>
  );
}
