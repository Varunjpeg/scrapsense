"use client";

import React, { useState } from "react";
import { MapPin, Navigation, Compass, Star, Phone, CheckCircle } from "lucide-react";
import { Recycler } from "@/context/AppContext";

interface MapPreviewProps {
  locations: Recycler[];
  selectedLocation: Recycler | null;
  onSelectLocation: (loc: Recycler) => void;
  userLocationInput?: string;
  typeLabel?: string;
}

export default function MapPreview({
  locations,
  selectedLocation,
  onSelectLocation,
  userLocationInput = "New Delhi, Delhi",
  typeLabel = "Dealers"
}: MapPreviewProps) {
  const [radarScanning, setRadarScanning] = useState(false); // default to false for Stripe-like minimal layout

  const getCoordinates = (id: string) => {
    if (id.includes("1") || id.includes("dl_1")) return { x: 35, y: 45 };
    if (id.includes("2") || id.includes("dl_2")) return { x: 65, y: 30 };
    if (id.includes("3") || id.includes("rf_1")) return { x: 45, y: 70 };
    return { x: 50, y: 50 };
  };

  return (
    <div className="flex flex-col lg:flex-row gap-5 w-full max-w-6xl mx-auto">
      {/* Dynamic Coordinate Radar Map */}
      <div className="flex-1 glassmorphism rounded-xl p-4.5 relative overflow-hidden h-[380px] lg:h-[450px] flex flex-col justify-between bg-card">
        <div className="absolute inset-0 eco-grid pointer-events-none opacity-20" />
        
        {/* Radar Circular Scan Effect */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <div className="w-[400px] h-[400px] rounded-full border border-card-border flex items-center justify-center relative">
            <div className="w-[280px] h-[280px] rounded-full border border-card-border flex items-center justify-center">
              <div className="w-[150px] h-[150px] rounded-full border border-card-border" />
            </div>
            {radarScanning && (
              <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,rgba(16,185,129,0.05),transparent_40%)] animate-[spin_8s_linear_infinite]" />
            )}
          </div>
        </div>

        {/* User Location Node */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center select-none">
          <div className="w-3.5 h-3.5 rounded-full bg-cyan-500/20 flex items-center justify-center animate-ping absolute" />
          <div className="w-3 h-3 rounded-full bg-cyan-500 border border-white flex items-center justify-center z-10" />
          <div className="bg-card text-cyan-500 text-[9px] font-bold px-2 py-0.5 rounded-full border border-cyan-500/30 mt-1 shadow whitespace-nowrap">
            You ({userLocationInput || "Delhi"})
          </div>
        </div>

        {/* Recycler / Dealer Pin Nodes */}
        {locations.map((loc) => {
          const coords = getCoordinates(loc.id);
          const isSelected = selectedLocation?.id === loc.id;
          
          return (
            <button
              key={loc.id}
              onClick={() => onSelectLocation(loc)}
              style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group focus:outline-none transition-all duration-200"
            >
              <div className="relative flex flex-col items-center">
                <div className={`p-1.5 rounded-lg transition-all duration-200 border shadow ${
                  isSelected 
                    ? "bg-emerald-500 text-slate-950 border-white scale-105" 
                    : "bg-card text-emerald-500 border-card-border group-hover:border-emerald-500/50 group-hover:scale-102"
                }`}>
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                
                <div className={`mt-1.5 px-2 py-0.5 rounded text-[8px] font-bold border transition-all duration-200 whitespace-nowrap ${
                  isSelected
                    ? "bg-emerald-500 text-slate-950 border-white"
                    : "bg-card text-foreground border-card-border group-hover:text-emerald-500"
                }`}>
                  {loc.businessName} ({loc.distance})
                </div>
              </div>
            </button>
          );
        })}

        {/* Header Controls */}
        <div className="z-10 flex items-center justify-between w-full">
          <div className="flex items-center gap-1.5 bg-background px-3 py-1 rounded-full border border-card-border text-[9px] font-bold text-muted-text">
            <Compass className="w-3 h-3 text-emerald-500" />
            <span>Eco-Radar Grid Active</span>
          </div>
          <button 
            onClick={() => setRadarScanning(!radarScanning)}
            className={`px-3 py-1 rounded-full text-[9px] font-bold border transition-all ${
              radarScanning 
                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/30" 
                : "bg-background text-muted-text border-card-border hover:bg-muted-border"
            }`}
          >
            {radarScanning ? "Pause Scan" : "Start Scan"}
          </button>
        </div>

        {/* Coordinates labels */}
        <div className="z-10 flex justify-between items-end w-full text-[8px] font-mono text-muted-text select-none pointer-events-none">
          <span>LAT: 28.6139° N / LONG: 77.2090° E</span>
          <span>GRID RANGE: 5.0 KM</span>
        </div>
      </div>

      {/* Selected Location Details Panel */}
      <div className="w-full lg:w-76 flex flex-col justify-center shrink-0">
        {selectedLocation ? (
          <div className="glassmorphism rounded-xl p-5 border border-card-border bg-card shadow animate-in fade-in duration-200">
            <div className="flex justify-between items-start">
              <div>
                <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[8px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">
                  Verified Partner
                </span>
                <h3 className="text-base font-bold text-foreground mt-2 leading-tight">
                  {selectedLocation.businessName}
                </h3>
              </div>
              <div className="flex items-center gap-0.5 bg-amber-400/10 text-amber-500 px-1.5 py-0.5 rounded text-[10px] font-bold border border-amber-400/20">
                <Star className="w-3 h-3 fill-current" />
                <span>{selectedLocation.ratings}</span>
              </div>
            </div>

            <div className="mt-3.5 space-y-2 text-xs text-foreground border-y border-card-border py-3">
              <div className="flex items-start gap-2">
                <Navigation className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                <div>
                  <div className="font-bold text-foreground">{selectedLocation.distance} away</div>
                  <div className="text-[10px] text-muted-text mt-0.5 leading-normal">{selectedLocation.address}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span className="text-[10px] text-emerald-500 font-bold font-mono">{selectedLocation.licenseNumber}</span>
              </div>
            </div>

            <div className="mt-3">
              <div className="text-[9px] font-bold text-muted-text uppercase tracking-wider">Specialties</div>
              <div className="flex flex-wrap gap-1 mt-1.5">
                {selectedLocation.services.slice(0, 2).map((serv, index) => (
                  <span key={index} className="text-[9px] bg-background border border-card-border text-foreground px-2 py-0.5 rounded">
                    {serv}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-2 mt-4.5">
              <a
                href={`tel:${selectedLocation.phone}`}
                className="flex items-center justify-center gap-1 py-2 rounded-lg border border-card-border hover:border-emerald-500/20 text-[10px] font-bold text-foreground transition-all bg-background hover:bg-emerald-500/5 text-center"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Shop</span>
              </a>
              <a
                href={`https://wa.me/${selectedLocation.phone.replace(/[^0-9]/g, "")}?text=Hi,%20I%20am%20interested%20in%20recycling%20my%20e-waste%20with%20ScrapSense.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-[10px] font-black text-slate-950 transition-all text-center"
              >
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        ) : (
          <div className="glassmorphism rounded-xl p-6 border border-card-border bg-card text-center flex flex-col items-center justify-center min-h-[220px]">
            <Navigation className="w-8 h-8 text-emerald-500/30 animate-bounce mb-3" />
            <h3 className="text-xs font-bold text-foreground">Select a Recycler</h3>
            <p className="text-[10px] text-muted-text mt-1 max-w-[180px] leading-normal">
              Click any coordinate pin on the radar map to view ratings and call webhooks.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
