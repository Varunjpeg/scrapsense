"use client";

import React, { useState } from "react";
import { Award, ShieldCheck, Mail, MapPin, Heart, Coins, CheckCircle, Clock, Trash2, Edit3 } from "lucide-react";
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
    { name: "Eco Starter", desc: "Successfully recycled first electronic item.", icon: "🌱", color: "border-emerald-500 text-emerald-400 bg-emerald-500/5" },
    { name: "Urban Miner", desc: "Accumulated over 4 carbon reward points.", icon: "⛏️", color: "border-amber-500 text-amber-400 bg-amber-500/5" },
    { name: "Eco Warrior", desc: "Diverted over 100 kg of e-waste from landfills.", icon: "🛡️", color: "border-cyan-500 text-cyan-400 bg-cyan-500/5" },
    { name: "Carbon Buster", desc: "Claimed top tier in regional carbon metrics.", icon: "⚡", color: "border-indigo-500 text-indigo-400 bg-indigo-500/5" }
  ];

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile(name, email, address ? address : undefined);
    setAddress("");
    setEditMode(false);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Upper Account Core */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Profile details */}
        <div className="lg:col-span-2 glassmorphism rounded-3xl p-6.5 border border-white/5 bg-slate-950/20 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute inset-0 eco-grid pointer-events-none opacity-20" />
          
          <div className="relative z-10">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                <img
                  src={user?.avatar}
                  alt="Avatar"
                  className="w-16 h-16 rounded-full border-2 border-emerald-500 shadow-md shadow-emerald-500/20"
                />
                <div>
                  <h3 className="text-xl font-black text-white">{user?.name}</h3>
                  <div className="flex items-center gap-1 text-xs text-gray-400 mt-1 font-mono">
                    <Mail className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{user?.email}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setEditMode(!editMode)}
                className="p-2 rounded-xl bg-white/5 border border-white/5 text-gray-400 hover:text-white transition-colors"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>

            {/* Profile update form */}
            {editMode ? (
              <form onSubmit={handleProfileSave} className="space-y-4 mt-6 border-t border-white/5 pt-6 animate-in fade-in duration-200">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-950 border border-white/5 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-950 border border-white/5 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Add New Location</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter pickup address to save..."
                    className="w-full bg-slate-950 border border-white/5 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none placeholder-gray-700"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setEditMode(false)}
                    className="py-2 px-4 rounded-xl border border-white/5 hover:border-white/10 text-xs text-gray-400 font-bold transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="py-2 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-emerald-500/10"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="mt-6 border-t border-white/5 pt-6 space-y-4">
                {/* Saved locations */}
                <div>
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Saved Pickup Locations</h4>
                  <div className="space-y-2 mt-2">
                    {user?.savedLocations && user.savedLocations.length > 0 ? (
                      user.savedLocations.map((loc, i) => (
                        <div key={i} className="flex items-center gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-white/5 text-xs text-gray-300">
                          <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span className="truncate">{loc}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-gray-500 italic mt-1 ml-1">No locations saved yet. Book a valuation pickup to save.</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="relative z-10 flex gap-4 mt-8 pt-4 border-t border-white/5 text-center">
            <div className="flex-1 bg-slate-950/60 p-3 rounded-2xl border border-white/5">
              <div className="text-lg font-black text-white">₹{user?.walletBalance.toLocaleString()}</div>
              <div className="text-[9px] text-gray-500 font-bold uppercase mt-1">Wallet Payouts</div>
            </div>
            <div className="flex-1 bg-slate-950/60 p-3 rounded-2xl border border-white/5">
              <div className="text-lg font-black text-white">{user?.rewardPoints} PTS</div>
              <div className="text-[9px] text-gray-500 font-bold uppercase mt-1">Accumulated Rewards</div>
            </div>
            <div className="flex-1 bg-slate-950/60 p-3 rounded-2xl border border-white/5">
              <div className="text-lg font-black text-white">{(user?.rewardPoints || 0) * 12} kg</div>
              <div className="text-[9px] text-gray-500 font-bold uppercase mt-1">Carbon Saved</div>
            </div>
          </div>
        </div>

        {/* CARBON LEADERBOARD GAMIFICATION */}
        <div className="glassmorphism rounded-3xl p-6 border border-white/5 bg-slate-950/20 flex flex-col justify-between h-[420px]">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-black text-white uppercase tracking-wider">Delhi Saving Leaderboard</h3>
            </div>

            <div className="space-y-2.5 overflow-y-auto max-h-[300px] pr-1.5">
              {leaderboard.map(el => (
                <div
                  key={el.name}
                  className={`p-2.5 rounded-xl border flex items-center justify-between transition-all ${
                    el.isCurrentUser
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                      : "bg-slate-950/60 border-white/5 text-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono font-bold text-gray-500 w-4">#{el.rank}</span>
                    <span className="text-xs font-bold truncate max-w-[110px]">{el.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-right">
                    <div className="text-[10px] font-extrabold text-white leading-none">{el.points} PTS</div>
                    <div className="text-[8px] text-emerald-400 font-medium">({el.carbonSaved} kg CO₂)</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-[10px] text-gray-500 font-bold text-center mt-3 pt-3 border-t border-white/5 uppercase">
            Recycle E-waste = Earn +2 Points per device
          </div>
        </div>

      </div>

      {/* GAMIFICATION ACHIEVEMENT BADGES */}
      <div className="space-y-4">
        <h3 className="text-sm font-black text-white uppercase tracking-wider">Your Environmental Badges</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {badgesList.map(badge => {
            const hasBadge = user?.badges.includes(badge.name) || (user?.rewardPoints && user.rewardPoints >= 4 && badge.name === "Urban Miner") || (user?.rewardPoints && user.rewardPoints >= 8 && badge.name === "Eco Warrior");
            return (
              <div
                key={badge.name}
                className={`glassmorphism rounded-2xl p-5 border text-center relative overflow-hidden transition-all duration-300 ${
                  hasBadge 
                    ? `${badge.color} scale-100 shadow-md` 
                    : "border-white/5 bg-slate-950/10 opacity-30 select-none grayscale"
                }`}
              >
                <div className="text-3xl filter drop-shadow">{badge.icon}</div>
                <h4 className="text-sm font-extrabold text-white mt-3 leading-tight">{badge.name}</h4>
                <p className="text-[10px] text-gray-400 mt-1 leading-normal max-w-[150px] mx-auto">{badge.desc}</p>
                {hasBadge && (
                  <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* COMPILATION AND SOLD HISTORIES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Pending collections */}
        <div className="glassmorphism rounded-3xl p-6.5 border border-white/5">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-black text-white uppercase tracking-wider">Scheduled Collection Orders</h3>
          </div>

          <div className="space-y-3.5">
            {pendingBookings.length > 0 ? (
              pendingBookings.map(b => (
                <div key={b.id} className="bg-slate-950/60 p-4 rounded-2xl border border-white/5 flex flex-col justify-between gap-3">
                  <div>
                    <div className="flex justify-between items-start">
                      <h4 className="text-xs font-bold text-white leading-snug">{b.deviceName}</h4>
                      <span className="font-mono text-[9px] text-emerald-400 font-extrabold">₹{b.price.toLocaleString()}</span>
                    </div>
                    <p className="text-[10px] text-gray-500 mt-0.5">Recycler: {b.recyclerName} • Slot: {b.timeSlot}</p>
                  </div>
                  <div className="flex justify-between items-center border-t border-white/5 pt-2">
                    <span className="text-[8px] font-mono text-gray-500 uppercase">Order ID: {b.id}</span>
                    <span className={`text-[8px] font-extrabold uppercase border px-2 py-0.5 rounded-full ${
                      b.status === "pending" 
                        ? "bg-slate-900 border-white/5 text-gray-400" 
                        : "bg-cyan-500/10 border-cyan-500 text-cyan-400 animate-pulse"
                    }`}>
                      {b.status === "pending" ? "Pending Approval" : b.status === "accepted" ? "Out for pickup" : b.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-500 italic text-center py-6">No scheduled pickup collections found.</p>
            )}
          </div>
        </div>

        {/* Sold device history */}
        <div className="glassmorphism rounded-3xl p-6.5 border border-white/5">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-black text-white uppercase tracking-wider">Sold Devices History</h3>
          </div>

          <div className="space-y-3.5">
            {soldHistory.length > 0 ? (
              soldHistory.map(b => (
                <div key={b.id} className="bg-slate-950/60 p-4 rounded-2xl border border-white/5 flex flex-col justify-between gap-3">
                  <div>
                    <div className="flex justify-between items-start">
                      <h4 className="text-xs font-bold text-white leading-snug">{b.deviceName}</h4>
                      <span className="font-mono text-[9px] text-emerald-400 font-extrabold">₹{b.price.toLocaleString()}</span>
                    </div>
                    <p className="text-[10px] text-gray-500 mt-0.5">Recycled with {b.recyclerName} on {b.date}</p>
                  </div>
                  <div className="flex justify-between items-center border-t border-white/5 pt-2">
                    <span className="text-[8px] font-mono text-gray-500 uppercase">Sold Receipt Ref</span>
                    <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[8px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                      <span>✓</span>
                      <span>Wallet Paid</span>
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-500 italic text-center py-6">No completed sales recorded in wallet.</p>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
