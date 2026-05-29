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
    <div className="space-y-6 max-w-5xl mx-auto text-left">
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6.5">
        
        {/* Core details card */}
        <div className="lg:col-span-2 glassmorphism rounded-xl p-6.5 border border-card-border bg-card relative overflow-hidden flex flex-col justify-between">
          <div className="absolute inset-0 eco-grid pointer-events-none opacity-20" />
          
          <div className="relative z-10">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-black text-2xl shadow-md">
                  {recycler?.businessName ? recycler.businessName[0] : "E"}
                </div>
                <div>
                  <h3 className="text-xl font-black text-foreground">{recycler?.businessName}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-accent mt-1.5 font-mono font-bold">
                    <ShieldCheck className="w-4 h-4 text-accent" />
                    <span>{recycler?.licenseNumber}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setEditMode(!editMode)}
                className="p-2 rounded-xl bg-background border border-card-border text-muted-text hover:text-foreground transition-colors cursor-pointer"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>

            {editMode ? (
              <form onSubmit={handleProfileSave} className="space-y-4 mt-6 border-t border-card-border pt-6 animate-in fade-in duration-200">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-muted-text uppercase tracking-wider font-mono">Business Name</label>
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="w-full bg-background border border-card-border rounded-xl px-3 py-2.5 text-xs text-foreground focus:outline-none focus:border-accent/30"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-muted-text uppercase tracking-wider font-mono">Owner Name</label>
                    <input
                      type="text"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      className="w-full bg-background border border-card-border rounded-xl px-3 py-2.5 text-xs text-foreground focus:outline-none focus:border-accent/30"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-muted-text uppercase tracking-wider font-mono">Contact Phone</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-background border border-card-border rounded-xl px-3 py-2.5 text-xs text-foreground focus:outline-none focus:border-accent/30"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-muted-text uppercase tracking-wider font-mono">Shop Address</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full bg-background border border-card-border rounded-xl px-3 py-2.5 text-xs text-foreground focus:outline-none focus:border-accent/30"
                    />
                  </div>
                </div>

                <div className="space-y-1 col-span-2">
                  <label className="text-[9px] font-bold text-muted-text uppercase tracking-wider font-mono">Services Checklist</label>
                  <div className="flex flex-wrap gap-2 mt-1.5">
                    {["Urban Mining", "PCB Shredding", "Lead Extraction", "Appliance Disassembly", "Display Delamination", "Battery Safekeeping"].map(serv => {
                      const isChecked = services.includes(serv);
                      return (
                        <button
                          key={serv}
                          type="button"
                          onClick={() => handleServiceToggle(serv)}
                          className={`px-3 py-1 rounded-lg border text-[10px] font-bold transition-all cursor-pointer ${
                            isChecked
                              ? "bg-accent/10 border-accent/20 text-accent"
                              : "bg-background border-card-border text-muted-text hover:text-foreground"
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
                    className="py-2 px-4 rounded-xl border border-card-border text-xs text-muted-text font-bold transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="py-2 px-5 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-bold transition-all shadow cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="mt-6 border-t border-card-border pt-6 space-y-4 text-xs text-foreground font-medium">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 bg-background p-3 rounded-xl border border-card-border">
                    <MapPin className="w-4 h-4 text-accent shrink-0" />
                    <span className="truncate">{recycler?.address}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-background p-3 rounded-xl border border-card-border">
                    <Phone className="w-4 h-4 text-accent shrink-0" />
                    <span>{recycler?.phone}</span>
                  </div>
                </div>

                {/* Services */}
                <div className="space-y-2">
                  <h4 className="text-[10px] font-bold text-muted-text uppercase tracking-wider font-mono">Certified Specialist Services</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {recycler?.services.map((serv, index) => (
                      <span key={index} className="text-[10px] bg-background border border-card-border text-foreground px-3 py-1 rounded-md">
                        {serv}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="relative z-10 flex gap-4 mt-8 pt-4 border-t border-card-border text-center">
            <div className="flex-1 bg-background p-3 rounded-2xl border border-card-border shadow-inner">
              <div className="text-lg font-black text-foreground">★ {recycler?.ratings}</div>
              <div className="text-[9px] text-muted-text font-bold uppercase mt-1 tracking-wider font-mono">Average Ratings</div>
            </div>
            <div className="flex-1 bg-background p-3 rounded-2xl border border-card-border shadow-inner">
              <div className="text-lg font-black text-foreground">{recycler?.points} PTS</div>
              <div className="text-[9px] text-muted-text font-bold uppercase mt-1 tracking-wider font-mono">Recycler Points</div>
            </div>
            <div className="flex-1 bg-background p-3 rounded-2xl border border-card-border shadow-inner">
              <div className="text-lg font-black text-foreground">100%</div>
              <div className="text-[9px] text-muted-text font-bold uppercase mt-1 tracking-wider font-mono">Verification</div>
            </div>
          </div>
        </div>

        {/* RECYCLER CERTIFICATES / VERIFIED CHECKS */}
        <div className="glassmorphism rounded-xl p-6 border border-card-border bg-card flex flex-col justify-between h-[400px]">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="w-4 h-4 text-accent" />
              <h3 className="text-[10px] font-black text-foreground uppercase tracking-wider font-mono">Environmental Licenses</h3>
            </div>

            <div className="space-y-4">
              <div className="bg-background p-3.5 rounded-xl border border-accent/10 flex items-start gap-3 shadow-inner">
                <CheckCircle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-extrabold text-foreground">CPCB E-Waste Authorized</div>
                  <div className="text-[10px] text-muted-text mt-0.5">Central Pollution Control Board authorized recycler.</div>
                </div>
              </div>

              <div className="bg-background p-3.5 rounded-xl border border-accent/10 flex items-start gap-3 shadow-inner">
                <CheckCircle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-extrabold text-foreground">ISO 14001:2015 Cert</div>
                  <div className="text-[10px] text-muted-text mt-0.5">Standardized international environmental management systems.</div>
                </div>
              </div>

              <div className="bg-background p-3.5 rounded-xl border border-accent/10 flex items-start gap-3 shadow-inner">
                <CheckCircle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-extrabold text-foreground">Secure Data Deletion</div>
                  <div className="text-[10px] text-muted-text mt-0.5">US DoD 5220.22-M sanitation levels standard.</div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-[9px] text-muted-text font-mono text-center pt-3 border-t border-card-border uppercase font-bold">
            All details verified by green inspectors
          </div>
        </div>

      </div>

      {/* REVIEWS SEGMENT */}
      <div className="glassmorphism rounded-xl p-6.5 border border-card-border bg-card">
        <h3 className="text-xs font-black text-foreground uppercase tracking-wider font-mono mb-4">Latest Seller Reviews</h3>
        
        {recycler?.reviews && recycler.reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recycler.reviews.map((rev, index) => (
              <div key={index} className="bg-background p-4.5 rounded-2xl border border-card-border space-y-3 shadow-inner">
                <div className="flex justify-between items-center">
                  <div className="text-xs font-bold text-foreground">{rev.author}</div>
                  <div className="flex items-center gap-0.5 bg-amber-400/10 text-amber-500 text-[10px] font-bold px-1.5 py-0.5 rounded border border-amber-400/20">
                    <span>★</span>
                    <span>{rev.rating}</span>
                  </div>
                </div>
                <p className="text-xs text-muted-text leading-normal font-medium">"{rev.text}"</p>
                <div className="text-[9px] text-muted-text font-bold uppercase tracking-wider font-mono pt-1 text-right">{rev.date}</div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-text italic py-4 font-medium">No client reviews logged yet.</p>
        )}
      </div>

    </div>
  );
}
