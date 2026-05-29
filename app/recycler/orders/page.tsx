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
    <div className="space-y-6 max-w-5xl mx-auto text-left">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-foreground">Pending Pickup Orders Queue</h2>
        <p className="text-xs text-muted-text mt-1 uppercase tracking-wider font-semibold">Accept door-step pickup requests and process instant payouts</p>
      </div>

      <div className="space-y-4">
        
        {orderQueue.length > 0 ? (
          <div className="space-y-5">
            {orderQueue.map((item) => (
              <div
                key={item.id}
                className="glassmorphism bg-card rounded-2xl p-6 border border-card-border space-y-5 transition-all hover:shadow-md"
              >
                {/* Meta details row */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-card-border pb-4 gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase border ${
                        item.valuation.canBeRefurbished
                          ? "bg-emerald-500/10 border-emerald-500/20 text-accent"
                          : "bg-amber-500/10 border-amber-500/20 text-amber-600"
                      }`}>
                        {item.valuation.canBeRefurbished ? "Divert to Repair" : "Divert to Recycling"}
                      </span>
                      <span className="text-[10px] text-muted-text font-mono font-bold uppercase">Order: #{item.id}</span>
                    </div>
                    
                    <h3 className="text-base font-extrabold text-foreground mt-1.5">{item.deviceName}</h3>
                  </div>

                  <div className="text-left md:text-right">
                    <div className="text-[9px] text-muted-text font-bold uppercase tracking-wider">Locked Payout Value</div>
                    <div className="text-lg font-black text-accent mt-0.5">₹{item.price.toLocaleString()}</div>
                  </div>
                </div>

                {/* Grid info: specifications & pickup location */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Diagnosis specifications */}
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-bold text-muted-text uppercase tracking-wider font-mono">Device diagnostics reported</h4>
                    <div className="grid grid-cols-2 gap-2 text-[10px] text-foreground">
                      <div className="bg-background p-2.5 rounded-lg border border-card-border">
                        <span className="text-muted-text block text-[9px] font-bold uppercase">Power State</span>
                        <span className="font-bold text-foreground mt-1 block">{item.valuation.isFunctional ? "Operational" : "Dead"}</span>
                      </div>
                      <div className="bg-background p-2.5 rounded-lg border border-card-border">
                        <span className="text-muted-text block text-[9px] font-bold uppercase">Physical Age</span>
                        <span className="font-bold text-foreground mt-1 block">{item.valuation.age}</span>
                      </div>
                      <div className="bg-background p-2.5 rounded-lg border border-card-border">
                        <span className="text-muted-text block text-[9px] font-bold uppercase">Screen Glass</span>
                        <span className="font-bold text-foreground mt-1 block">{item.valuation.screenCondition}</span>
                      </div>
                      <div className="bg-background p-2.5 rounded-lg border border-card-border">
                        <span className="text-muted-text block text-[9px] font-bold uppercase">Chassis Outer</span>
                        <span className="font-bold text-foreground mt-1 block">{item.valuation.physicalCondition}</span>
                      </div>
                    </div>
                  </div>

                  {/* Pickup specs */}
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-bold text-muted-text uppercase tracking-wider font-mono">Logistics & address details</h4>
                    <div className="bg-background p-4 rounded-xl border border-card-border space-y-3 text-xs text-foreground">
                      <div className="flex items-start gap-2.5">
                        <Navigation className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                        <div>
                          <div className="font-bold text-foreground">{item.userName}</div>
                          <div className="text-[10px] text-muted-text mt-0.5 font-medium leading-normal">{item.userAddress}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5 border-t border-card-border pt-2.5">
                        <Phone className="w-4 h-4 text-accent" />
                        <span className="font-semibold">{item.userPhone}</span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Operations dispatcher action controls depending on current status */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-t border-card-border pt-4 mt-2">
                  {/* Status track slider */}
                  <div className="flex items-center gap-1.5 text-xs font-bold text-muted-text select-none">
                    <span className="text-muted-text uppercase tracking-wider text-[9px] mr-1">Current State:</span>
                    <span className={`px-2 py-0.5 rounded-full uppercase text-[8px] font-black border ${
                      item.status === "pending" 
                        ? "bg-muted-border border-card-border text-muted-text"
                        : "bg-accent/15 border-accent/30 text-accent animate-pulse"
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
                          className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl border border-card-border hover:border-red-500/30 text-xs font-bold text-red-500 hover:bg-red-500/5 transition-all cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                        <button
                          onClick={() => handleAccept(item.id)}
                          className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 py-2.5 px-6 rounded-xl bg-accent hover:bg-accent-hover text-white font-bold transition-all shadow cursor-pointer text-xs"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Accept Pickup</span>
                        </button>
                      </>
                    )}

                    {item.status === "accepted" && (
                      <button
                        onClick={() => handleStartPickup(item.id)}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 py-2.5 px-6 rounded-xl bg-accent hover:bg-accent-hover text-white font-bold transition-all shadow cursor-pointer text-xs"
                      >
                        <span>Dispatch Pick Up Agent</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}

                    {item.status === "out_for_pickup" && (
                      <button
                        onClick={() => handleComplete(item.id)}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 py-3 px-8 rounded-xl bg-accent hover:bg-accent-hover text-white font-black transition-all shadow cursor-pointer text-xs"
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
          <div className="glassmorphism p-16 text-center bg-card border border-card-border flex flex-col items-center justify-center">
            <Inbox className="w-12 h-12 text-accent/30 animate-bounce mb-3" />
            <h3 className="text-base font-bold text-foreground">Queue is empty</h3>
            <p className="text-xs text-muted-text mt-1.5 max-w-xs mx-auto leading-relaxed font-medium">
              No pending doorstep e-waste bookings are currently registered. Let's wait for users in your service zone to lock their device valuations.
            </p>
          </div>
        )}

      </div>

    </div>
  );
}
