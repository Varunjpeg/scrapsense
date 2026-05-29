"use client";

import React, { useState } from "react";
import { Navigation, Compass, Search, Star, Phone, MessageCircle, Loader2 } from "lucide-react";
import { useApp, Recycler } from "@/context/AppContext";
import MapPreview from "@/components/MapPreview";

export default function SearchRefurbishers() {
  const { refurbishers, searchNearbyRecyclers } = useApp();
  const [locationInput, setLocationInput] = useState("Okhla, New Delhi");
  const [activeSearch, setActiveSearch] = useState("Okhla, New Delhi");
  const [selectedRefurb, setSelectedRefurb] = useState<Recycler | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!locationInput.trim()) return;
    
    setLoading(true);
    try {
      const res = await searchNearbyRecyclers(locationInput);
      setActiveSearch(locationInput);
      if (res.refurbishers && res.refurbishers.length > 0) {
        setSelectedRefurb(res.refurbishers[0]);
      } else {
        setSelectedRefurb(null);
      }
    } catch (err) {
      console.error("Failed search:", err);
    } finally {
      setLoading(false);
    }
  };

  // Set default selected refurbisher if not set
  if (!selectedRefurb && refurbishers && refurbishers.length > 0) {
    setSelectedRefurb(refurbishers[0]);
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Search Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-foreground">Certified Hardware Refurbishers</h2>
          <p className="text-xs text-muted-text mt-1 uppercase tracking-wider font-semibold">Divert dead motherboards and panels to repair specialist shops</p>
        </div>

        {/* Location Search Form */}
        <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto bg-card p-1.5 border border-card-border rounded-2xl shadow-sm">
          <div className="relative flex-1 md:flex-none md:w-60 flex items-center">
            <Search className="absolute left-3.5 w-4 h-4 text-muted-text" />
            <input
              type="text"
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
              placeholder="Enter location e.g. South Ext..."
              className="bg-transparent text-xs text-foreground pl-10 pr-4 py-2 w-full focus:outline-none placeholder-muted-text"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-bold transition-all shadow-md shadow-accent/10 cursor-pointer shrink-0 flex items-center gap-1.5 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Locating...</span>
              </>
            ) : (
              <span>Locate nearest</span>
            )}
          </button>
        </form>
      </div>

      {/* Map Preview Grid */}
      <div className="glassmorphism p-4.5 bg-card border border-card-border shadow-sm">
        <MapPreview
          locations={refurbishers}
          selectedLocation={selectedRefurb}
          onSelectLocation={setSelectedRefurb}
          userLocationInput={activeSearch}
          typeLabel="Refurbishers"
        />
      </div>

      {/* Complete Refurbishers list */}
      <div className="space-y-4">
        <h3 className="text-sm font-black text-foreground uppercase tracking-wider">Verified Refurbishment Specialists Near {activeSearch}</h3>
        
        {refurbishers.length === 0 ? (
          <div className="glassmorphism p-12 text-center text-muted-text">
            No refurbishment centers found near "{activeSearch}". Try searching for major cities like "Delhi", "Mumbai", or "Bangalore".
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {refurbishers.map((refurb) => {
              const isSelected = selectedRefurb?.id === refurb.id;
              return (
                <div
                  key={refurb.id}
                  onClick={() => setSelectedRefurb(refurb)}
                  className={`glassmorphism rounded-3xl p-6 border transition-all cursor-pointer ${
                    isSelected 
                      ? "border-accent bg-accent/5 shadow-md" 
                      : "border-card-border bg-card hover:border-accent/40 hover:shadow-md"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[9px] bg-accent/10 text-accent border border-accent/20 px-2 py-0.5 rounded font-mono font-bold uppercase">
                        Certified Refurbisher
                      </span>
                      <h4 className="text-lg font-black text-foreground mt-2 leading-tight">
                        {refurb.businessName}
                      </h4>
                      <p className="text-[11px] text-muted-text font-semibold mt-1">Owner: {refurb.ownerName}</p>
                    </div>
                    <div className="flex items-center gap-0.5 bg-amber-400/15 border border-amber-400/30 text-xs font-bold text-amber-500 px-2 py-0.5 rounded-lg">
                      <span>★</span>
                      <span>{refurb.ratings}</span>
                    </div>
                  </div>

                  <div className="mt-4 text-xs text-foreground space-y-2 border-t border-card-border pt-4">
                    <div className="flex items-start gap-2">
                      <Navigation className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                      <div>
                        <div className="font-bold text-foreground">{refurb.distance} away</div>
                        <div className="text-muted-text text-[11px] mt-0.5">{refurb.address}</div>
                      </div>
                    </div>
                  </div>

                  {/* Specialties */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {refurb.services.map((serv, idx) => (
                      <span key={idx} className="text-[9px] bg-muted-border border border-card-border text-muted-text px-2.5 py-1 rounded">
                        {serv}
                      </span>
                    ))}
                  </div>

                  {/* Direct Action Webhooks */}
                  <div className="grid grid-cols-2 gap-3 mt-6 border-t border-card-border pt-4">
                    <a
                      href={`tel:${refurb.phone}`}
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-card-border hover:border-accent/30 text-xs font-bold text-foreground transition-colors bg-muted-border hover:bg-accent/10"
                    >
                      <Phone className="w-3.5 h-3.5 text-accent" />
                      <span>Call Shop</span>
                    </a>
                    <a
                      href={`https://wa.me/${refurb.phone.replace(/[^0-9]/g, "")}?text=Hi,%20I%20am%20interested%20in%20repairing%20my%20device%20with%20ScrapSense.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-bold transition-all shadow-sm"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}

