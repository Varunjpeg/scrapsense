"use client";

import React, { useState } from "react";
import { Award, ShieldCheck, Mail, MapPin, Heart, Coins, CheckCircle, Clock, Edit3 } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function UserProfile() {
  const { user, bookings, leaderboard, updateUserProfile } = useApp();

  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [address, setAddress] = useState("");

  const pendingBookings = bookings.filter(b => b.status !== "completed" && b.status !== "rejected");
  const soldHistory = bookings.filter(b => b.status === "completed");

  const badgesList = [
    { name: "Eco Starter", desc: "Diverted your first e-waste item.", icon: "🌱", color: "border-emerald-500/20 text-emerald-500 bg-emerald-500/5" },
    { name: "Urban Miner", desc: "Accumulated 4+ carbon points.", icon: "⛏️", color: "border-emerald-500/20 text-emerald-500 bg-emerald-500/5" },
    { name: "Eco Warrior", desc: "Diverted 100+ kg of e-waste.", icon: "🛡️", color: "border-emerald-500/20 text-emerald-500 bg-emerald-500/5" },
    { name: "Carbon Buster", desc: "Top tier in Delhi regional savers.", icon: "⚡", color: "border-emerald-500/20 text-emerald-500 bg-emerald-500/5" }
  ];

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile(name, email, address ? address : undefined);
    setAddress("");
    setEditMode(false);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto text-left">
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6.5">
        
        {/* Profile Card */}
        <div className="lg:col-span-2 glassmorphism rounded-xl p-5.5 border border-card-border bg-card relative overflow-hidden flex flex-col justify-between">
          <div className="absolute inset-0 eco-grid pointer-events-none opacity-20" />
          
          <div className="relative z-10 w-full">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3.5">
                <img
                  src={user?.avatar}
                  alt="Avatar"
                  className="w-12 h-12 rounded-full border border-card-border shadow-sm"
                />
                <div>
                  <h3 className="text-base font-extrabold text-foreground">{user?.name}</h3>
                  <div className="flex items-center gap-1 text-[10px] text-muted-text mt-0.5 font-mono">
                    <Mail className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{user?.email}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setEditMode(!editMode)}
                className="p-2 rounded-lg bg-background border border-card-border text-muted-text hover:text-foreground transition-all cursor-pointer"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>

            {editMode ? (
              <form onSubmit={handleProfileSave} className="space-y-3.5 mt-5 border-t border-card-border pt-4 animate-in fade-in duration-200">
                <div className="grid grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-muted-text uppercase tracking-wider font-mono">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-background border border-card-border rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-emerald-500/30"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-muted-text uppercase tracking-wider font-mono">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-background border border-card-border rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-emerald-500/30"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-muted-text uppercase tracking-wider font-mono">Add New Location</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter pickup address to save..."
                    className="w-full bg-background border border-card-border rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-emerald-500/30 placeholder-gray-500"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEditMode(false)}
                    className="py-1.5 px-3.5 rounded-lg border border-card-border text-xs text-gray-500 hover:text-foreground font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="py-1.5 px-4.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="mt-5 border-t border-card-border pt-4 space-y-4">
                <div>
                  <h4 className="text-[9px] font-bold text-muted-text uppercase tracking-wider font-mono">Saved Pickup Locations</h4>
                  <div className="space-y-2 mt-2">
                    {user?.savedLocations && user.savedLocations.length > 0 ? (
                      user.savedLocations.map((loc, i) => (
                        <div key={i} className="flex items-center gap-2 bg-background p-2.5 rounded-lg border border-card-border text-[11px] text-foreground font-medium">
                          <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span className="truncate">{loc}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-[10px] text-gray-500 italic mt-1 font-medium">No locations saved yet.</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="relative z-10 flex gap-3.5 mt-6 pt-4 border-t border-card-border text-center w-full">
            <div className="flex-1 bg-background p-3 rounded-xl border border-card-border shadow-inner">
              <div className="text-base font-extrabold text-foreground">₹{user?.walletBalance.toLocaleString()}</div>
              <div className="text-[8px] text-muted-text font-bold uppercase tracking-wider font-mono mt-1">Wallet worth</div>
            </div>
            <div className="flex-1 bg-background p-3 rounded-xl border border-card-border shadow-inner">
              <div className="text-base font-extrabold text-foreground">{user?.rewardPoints} PTS</div>
              <div className="text-[8px] text-muted-text font-bold uppercase tracking-wider font-mono mt-1">Eco Reward Pts</div>
            </div>
            <div className="flex-1 bg-background p-3 rounded-xl border border-card-border shadow-inner">
              <div className="text-base font-extrabold text-foreground">{(user?.rewardPoints || 0) * 12} kg</div>
              <div className="text-[8px] text-muted-text font-bold uppercase tracking-wider font-mono mt-1">Carbon offset</div>
            </div>
          </div>
        </div>

        {/* REGIONAL CARBON LEADERBOARD */}
        <div className="glassmorphism rounded-xl p-5 border border-card-border bg-card flex flex-col justify-between h-[360px]">
          <div>
            <div className="flex items-center gap-2 mb-3.5">
              <Award className="w-4 h-4 text-emerald-500" />
              <h3 className="text-[10px] font-black text-foreground uppercase tracking-wider font-mono">Delhi Carbon Leaderboard</h3>
            </div>

            <div className="space-y-2 overflow-y-auto max-h-[240px] pr-1">
              {leaderboard.map(el => (
                <div
                  key={el.name}
                  className={`p-2 rounded-lg border flex items-center justify-between transition-all ${
                    el.isCurrentUser
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                      : "bg-background border-card-border text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-[9px] font-mono font-bold text-muted-text w-4">#{el.rank}</span>
                    <span className="text-[11px] font-bold truncate max-w-[100px]">{el.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-right font-medium">
                    <div className="text-[10px] font-extrabold text-foreground">{el.points} PTS</div>
                    <div className="text-[8px] text-emerald-500 font-bold">({el.carbonSaved} kg)</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-[8px] text-muted-text font-bold text-center mt-3 pt-3 border-t border-card-border uppercase font-mono">
            Earn 2 carbon reward points per transaction
          </div>
        </div>

      </div>

      {/* ACHIEVEMENT BADGES */}
      <div className="space-y-3">
        <h3 className="text-[10px] font-black text-foreground uppercase tracking-wider font-mono">Your Environmental Badges</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {badgesList.map(badge => {
            const hasBadge = user?.badges.includes(badge.name) || (user?.rewardPoints && user.rewardPoints >= 4 && badge.name === "Urban Miner") || (user?.rewardPoints && user.rewardPoints >= 8 && badge.name === "Eco Warrior");
            return (
              <div
                key={badge.name}
                className={`glassmorphism rounded-xl p-4 border text-center relative overflow-hidden transition-all duration-300 ${
                  hasBadge 
                    ? `${badge.color} scale-100 shadow-sm` 
                    : "border-card-border bg-background opacity-25 grayscale"
                }`}
              >
                <div className="text-2xl">{badge.icon}</div>
                <h4 className="text-xs font-extrabold text-foreground mt-2 leading-tight">{badge.name}</h4>
                <p className="text-[9px] text-muted-text mt-1 leading-normal max-w-[140px] mx-auto font-medium">{badge.desc}</p>
                {hasBadge && (
                  <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* TRANSACTION HISTORIES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5.5">
        
        {/* Pending */}
        <div className="glassmorphism rounded-xl p-5 border border-card-border bg-card">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-emerald-500" />
            <h3 className="text-[10px] font-black text-foreground uppercase tracking-wider font-mono">Scheduled Collection Pickups</h3>
          </div>

          <div className="space-y-2.5">
            {pendingBookings.length > 0 ? (
              pendingBookings.map(b => (
                <div key={b.id} className="bg-background p-3.5 rounded-xl border border-card-border flex flex-col justify-between gap-3">
                  <div>
                    <div className="flex justify-between items-start">
                      <h4 className="text-xs font-bold text-foreground leading-snug">{b.deviceName}</h4>
                      <span className="font-mono text-[10px] text-emerald-500 font-extrabold">₹{b.price.toLocaleString()}</span>
                    </div>
                    <p className="text-[10px] text-muted-text mt-0.5">Recycler: {b.recyclerName} • Slot: {b.timeSlot}</p>
                  </div>
                  <div className="flex justify-between items-center border-t border-card-border pt-2 text-[9px] font-bold text-muted-text">
                    <span className="font-mono">Order ID: {b.id}</span>
                    <span className={`text-[8px] font-extrabold uppercase border px-2 py-0.5 rounded ${
                      b.status === "pending" 
                        ? "bg-muted-border border-card-border text-muted-text" 
                        : "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                    }`}>
                      {b.status === "pending" ? "Awaiting Accept" : b.status === "accepted" ? "Agent assigned" : b.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-500 italic text-center py-6">No scheduled collections pending.</p>
            )}
          </div>
        </div>

        {/* Cleared */}
        <div className="glassmorphism rounded-xl p-5 border border-card-border bg-card">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <h3 className="text-[10px] font-black text-foreground uppercase tracking-wider font-mono">Cleared Sold Ledger</h3>
          </div>

          <div className="space-y-2.5">
            {soldHistory.length > 0 ? (
              soldHistory.map(b => (
                <div key={b.id} className="bg-background p-3.5 rounded-xl border border-card-border flex flex-col justify-between gap-3">
                  <div>
                    <div className="flex justify-between items-start">
                      <h4 className="text-xs font-bold text-foreground leading-snug">{b.deviceName}</h4>
                      <span className="font-mono text-[10px] text-emerald-500 font-extrabold">₹{b.price.toLocaleString()}</span>
                    </div>
                    <p className="text-[10px] text-muted-text mt-0.5">Recycled with {b.recyclerName} on {b.date}</p>
                  </div>
                  <div className="flex justify-between items-center border-t border-card-border pt-2 text-[9px] font-bold text-muted-text">
                    <span className="font-mono">Cleared sold reference</span>
                    <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[8px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">
                      ✓ Paid
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-500 italic text-center py-6">No completed sales logged in wallet.</p>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
