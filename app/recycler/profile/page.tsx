"use client";

import React, { useState } from "react";
import { Award, Star, Phone, MapPin, Mail, ShieldCheck, CheckCircle, Edit3, ShieldAlert } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function RecyclerProfile() {
  const { recycler, updateRecyclerProfile } = useApp();

  const [editMode, setEditMode] = useState(false);
  const [businessName, setBusinessName] = useState(recycler?.businessName || "");
  const [ownerName, setOwnerName] = useState(recycler?.ownerName || "");
  const [phone, setPhone] = useState(recycler?.phone || "");
  const [address, setAddress] = useState(recycler?.address || "");
  const [services, setServices] = useState<string[]>(recycler?.services || []);

  const handleServiceToggle = (serv: string) => {
    setServices(prev =>
      prev.includes(serv) ? prev.filter(s => s !== serv) : [...prev, serv]
    );
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateRecyclerProfile(businessName, ownerName, phone, address, services);
    setEditMode(false);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Core details card */}
        <div className="lg:col-span-2 glassmorphism rounded-3xl p-6.5 border border-white/5 bg-slate-950/20 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute inset-0 eco-grid pointer-events-none opacity-20" />
          
          <div className="relative z-10">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-slate-950 font-black text-2xl shadow-lg shadow-emerald-500/25">
                  {recycler?.businessName[0]}
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">{recycler?.businessName}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-1 font-mono font-medium">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">{recycler?.licenseNumber}</span>
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

            {editMode ? (
              <form onSubmit={handleProfileSave} className="space-y-4 mt-6 border-t border-white/5 pt-6 animate-in fade-in duration-200">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Business Name</label>
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="w-full bg-slate-950 border border-white/5 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Owner Name</label>
                    <input
                      type="text"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      className="w-full bg-slate-950 border border-white/5 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Contact Phone</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-slate-950 border border-white/5 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Shop Address</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full bg-slate-950 border border-white/5 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1 col-span-2">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Services Checklist</label>
                  <div className="flex flex-wrap gap-2 mt-1.5">
                    {["Urban Mining", "PCB Shredding", "Lead Extraction", "Appliance Disassembly", "Display Delamination", "Battery Safekeeping"].map(serv => {
                      const isChecked = services.includes(serv);
                      return (
                        <button
                          key={serv}
                          type="button"
                          onClick={() => handleServiceToggle(serv)}
                          className={`px-3 py-1 rounded-lg border text-[10px] font-bold transition-all ${
                            isChecked
                              ? "bg-emerald-500/15 border-emerald-500 text-emerald-400"
                              : "bg-slate-950 border-white/5 text-gray-400 hover:text-white"
                          }`}
                        >
                          {serv}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
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
              <div className="mt-6 border-t border-white/5 pt-6 space-y-4 text-xs text-gray-300">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 bg-slate-950/60 p-3 rounded-xl border border-white/5">
                    <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="truncate">{recycler?.address}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-950/60 p-3 rounded-xl border border-white/5">
                    <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{recycler?.phone}</span>
                  </div>
                </div>

                {/* Services */}
                <div>
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Certified Specialist Services</h4>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {recycler?.services.map((serv, index) => (
                      <span key={index} className="text-[10px] bg-slate-950 border border-white/5 text-gray-300 px-3 py-1 rounded-md">
                        {serv}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="relative z-10 flex gap-4 mt-8 pt-4 border-t border-white/5 text-center">
            <div className="flex-1 bg-slate-950/60 p-3 rounded-2xl border border-white/5">
              <div className="text-lg font-black text-white">★ {recycler?.ratings}</div>
              <div className="text-[9px] text-gray-500 font-bold uppercase mt-1">Average Ratings</div>
            </div>
            <div className="flex-1 bg-slate-950/60 p-3 rounded-2xl border border-white/5">
              <div className="text-lg font-black text-white">{recycler?.points} PTS</div>
              <div className="text-[9px] text-gray-500 font-bold uppercase mt-1">Recycler Points</div>
            </div>
            <div className="flex-1 bg-slate-950/60 p-3 rounded-2xl border border-white/5">
              <div className="text-lg font-black text-white">100%</div>
              <div className="text-[9px] text-gray-500 font-bold uppercase mt-1">Verification Index</div>
            </div>
          </div>
        </div>

        {/* RECYCLER CERTIFICATES / VERIFIED CHECKS */}
        <div className="glassmorphism rounded-3xl p-6 border border-white/5 bg-slate-950/20 flex flex-col justify-between h-[400px]">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-black text-white uppercase tracking-wider">Environmental Licenses</h3>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-950/60 p-3 rounded-xl border border-emerald-500/10 flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-extrabold text-white">CPCB E-Waste Authorized</div>
                  <div className="text-[10px] text-gray-500 mt-0.5">Central Pollution Control Board authorized recycler.</div>
                </div>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-xl border border-emerald-500/10 flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-extrabold text-white">ISO 14001:2015 Cert</div>
                  <div className="text-[10px] text-gray-500 mt-0.5">Standardized international environmental management systems.</div>
                </div>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-xl border border-emerald-500/10 flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-extrabold text-white">Secure Data Deletion</div>
                  <div className="text-[10px] text-gray-500 mt-0.5">US DoD 5220.22-M sanitation levels standard.</div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-[9px] text-gray-500 font-mono text-center pt-3 border-t border-white/5 uppercase">
            All details verified by green inspectors
          </div>
        </div>

      </div>

      {/* REVIEWS SEGMENT */}
      <div className="glassmorphism rounded-3xl p-6.5 border border-white/5 bg-slate-950/20">
        <h3 className="text-sm font-black text-white uppercase tracking-wider mb-4">Latest Seller Reviews</h3>
        
        {recycler?.reviews && recycler.reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recycler.reviews.map((rev, index) => (
              <div key={index} className="bg-slate-950/60 p-4.5 rounded-2xl border border-white/5 space-y-3">
                <div className="flex justify-between items-center">
                  <div className="text-xs font-bold text-white">{rev.author}</div>
                  <div className="flex items-center gap-0.5 bg-amber-400/10 text-amber-400 text-[10px] font-bold px-1.5 py-0.5 rounded">
                    <span>★</span>
                    <span>{rev.rating}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-400 leading-normal">"{rev.text}"</p>
                <div className="text-[9px] text-gray-500 font-bold uppercase tracking-wider font-mono pt-1 text-right">{rev.date}</div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-500 italic py-4">No client reviews logged yet.</p>
        )}
      </div>

    </div>
  );
}
