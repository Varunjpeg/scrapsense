"use client";

import React, { useState } from "react";
import { Navigation, Compass, Search, Star, Phone, MessageCircle } from "lucide-react";
import { useApp, Recycler } from "@/context/AppContext";
import MapPreview from "@/components/MapPreview";

export default function SearchRefurbishers() {
  const { refurbishers } = useApp();
  const [locationInput, setLocationInput] = useState("Okhla, New Delhi");
  const [activeSearch, setActiveSearch] = useState("Okhla, New Delhi");
  const [selectedRefurb, setSelectedRefurb] = useState<Recycler | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!locationInput.trim()) return;
    setActiveSearch(locationInput);
    setSelectedRefurb(refurbishers[0]);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Search Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-white">Certified Hardware Refurbishers</h2>
          <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-semibold">Divert dead motherboards and panels to repair specialist shops</p>
        </div>

        {/* Location Search Form */}
        <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto bg-slate-950/80 p-1.5 border border-white/5 rounded-2xl">
          <div className="relative flex-1 md:flex-none md:w-60">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
              placeholder="Enter location e.g. South Ext..."
              className="bg-transparent text-xs text-white pl-10 pr-4 py-2 w-full focus:outline-none placeholder-gray-600"
            />
          </div>
          <button 
            type="submit" 
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-emerald-500/10 cursor-pointer shrink-0"
          >
            Locate nearest
          </button>
        </form>
      </div>

      {/* Map Preview Grid */}
      <MapPreview
        locations={refurbishers}
        selectedLocation={selectedRefurb}
        onSelectLocation={setSelectedRefurb}
        userLocationInput={activeSearch}
        typeLabel="Refurbishers"
      />

      {/* Complete Refurbishers list */}
      <div className="space-y-4">
        <h3 className="text-sm font-black text-white uppercase tracking-wider">Verified Refurbishment Specialists Near {activeSearch}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {refurbishers.map((refurb) => {
            const isSelected = selectedRefurb?.id === refurb.id;
            return (
              <div
                key={refurb.id}
                onClick={() => setSelectedRefurb(refurb)}
                className={`glassmorphism rounded-3xl p-6.5 border transition-all cursor-pointer ${
                  isSelected 
                    ? "border-emerald-500/40 bg-emerald-950/5 shadow-xl" 
                    : "border-white/5 bg-slate-950/20 hover:border-white/10 hover:bg-slate-950/40"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9px] bg-slate-950 text-cyan-400 border border-cyan-500/10 px-2 py-0.5 rounded font-mono font-bold uppercase">
                      Certified Refurbisher
                    </span>
                    <h4 className="text-lg font-black text-white mt-2 leading-tight">
                      {refurb.businessName}
                    </h4>
                    <p className="text-[11px] text-gray-500 font-semibold mt-1">Owner: {refurb.ownerName}</p>
                  </div>
                  <div className="flex items-center gap-0.5 bg-amber-400/10 border border-amber-400/20 text-xs font-bold text-amber-400 px-2 py-0.5 rounded-lg">
                    <span>★</span>
                    <span>{refurb.ratings}</span>
                  </div>
                </div>

                <div className="mt-4 text-xs text-gray-300 space-y-2 border-t border-white/5 pt-4">
                  <div className="flex items-start gap-2">
                    <Navigation className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                    <div>
                      <div className="font-semibold text-gray-200">{refurb.distance} away</div>
                      <div className="text-gray-400 text-[11px] mt-0.5">{refurb.address}</div>
                    </div>
                  </div>
                </div>

                {/* Specialties */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {refurb.services.slice(0, 3).map((serv, idx) => (
                    <span key={idx} className="text-[9px] bg-slate-950 border border-white/5 text-gray-400 px-2.5 py-1 rounded">
                      {serv}
                    </span>
                  ))}
                </div>

                {/* Direct Action Webhooks */}
                <div className="grid grid-cols-2 gap-3 mt-6 border-t border-white/5 pt-4">
                  <a
                    href={`tel:${refurb.phone}`}
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/5 hover:border-emerald-500/30 text-xs font-bold text-white transition-colors bg-white/5 hover:bg-emerald-500/10"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Shop</span>
                  </a>
                  <a
                    href={`https://wa.me/${refurb.phone.replace(/[^0-9]/g, "")}?text=Hi,%20I%20am%20interested%20in%20repairing%20my%20device%20with%20ScrapSense.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-emerald-500/20 hover:border-emerald-500 bg-emerald-500/10 text-emerald-400 hover:text-slate-950 hover:bg-emerald-500 text-xs font-bold transition-all shadow-md shadow-emerald-500/5"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
