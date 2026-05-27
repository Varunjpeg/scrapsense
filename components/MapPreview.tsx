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
  const [radarScanning, setRadarScanning] = useState(true);

  // Generate deterministic coordinates on a grid for the interactive map
  const getCoordinates = (id: string) => {
    // Return mock coordinates mapped to a 0-100 grid for premium visual display
    if (id.includes("1")) return { x: 35, y: 45 };
    if (id.includes("2")) return { x: 65, y: 30 };
    if (id.includes("3")) return { x: 45, y: 70 };
    if (id.includes("4")) return { x: 80, y: 65 };
    return { x: 50, y: 50 };
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full max-w-6xl mx-auto p-4">
      {/* Dynamic Eco-Map Grid */}
      <div className="flex-1 glassmorphism rounded-3xl p-6 relative overflow-hidden h-[420px] lg:h-[500px] flex flex-col justify-between">
        {/* Neon Tech Grid Overlay */}
        <div className="absolute inset-0 eco-grid pointer-events-none opacity-40" />
        
        {/* Radar Circular Scan Effect */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <div className="w-[500px] h-[500px] rounded-full border border-emerald-500/10 flex items-center justify-center relative animate-pulse-slow">
            <div className="w-[350px] h-[350px] rounded-full border border-emerald-500/15 flex items-center justify-center">
              <div className="w-[200px] h-[200px] rounded-full border border-emerald-500/20" />
            </div>
            {/* Rotating Scan Line */}
            {radarScanning && (
              <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,rgba(16,185,129,0.1),transparent_40%)] animate-[spin_8s_linear_infinite]" />
            )}
          </div>
        </div>

        {/* User Marker (Center) */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center select-none">
          <div className="w-5 h-5 rounded-full bg-cyan-400 flex items-center justify-center animate-ping absolute" />
          <div className="w-4 h-4 rounded-full bg-cyan-500 border-2 border-white flex items-center justify-center shadow-lg shadow-cyan-500/30 z-10" />
          <div className="bg-slate-900/90 text-cyan-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-cyan-500/20 mt-1 shadow-md backdrop-blur-sm whitespace-nowrap">
            You ({userLocationInput || "Delhi"})
          </div>
        </div>

        {/* Recycler / Dealer Nodes */}
        {locations.map((loc) => {
          const coords = getCoordinates(loc.id);
          const isSelected = selectedLocation?.id === loc.id;
          
          return (
            <button
              key={loc.id}
              onClick={() => onSelectLocation(loc)}
              style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group focus:outline-none transition-all duration-300"
            >
              <div className="relative flex flex-col items-center">
                {/* Ping Glow for selected/hovered item */}
                <div 
                  className={`w-7 h-7 rounded-full bg-emerald-400 flex items-center justify-center animate-ping absolute transition-opacity duration-300 ${
                    isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-40"
                  }`} 
                />
                
                {/* Pin Icon */}
                <div className={`p-2 rounded-xl transition-all duration-300 border shadow-lg ${
                  isSelected 
                    ? "bg-emerald-500 text-slate-950 border-white scale-110 shadow-emerald-500/35" 
                    : "bg-slate-900 text-emerald-400 border-emerald-500/30 group-hover:bg-emerald-950 group-hover:border-emerald-400 group-hover:scale-105"
                }`}>
                  <MapPin className="w-4 h-4" />
                </div>
                
                {/* Brief floating label */}
                <div className={`mt-1.5 px-2 py-0.5 rounded-md text-[9px] font-bold border transition-all duration-300 whitespace-nowrap backdrop-blur-sm ${
                  isSelected
                    ? "bg-emerald-500 text-slate-950 border-white font-extrabold"
                    : "bg-slate-900/90 text-gray-300 border-white/5 group-hover:text-emerald-400 group-hover:border-emerald-500/20"
                }`}>
                  {loc.businessName} ({loc.distance})
                </div>
              </div>
            </button>
          );
        })}

        {/* Header Controls */}
        <div className="z-10 flex items-center justify-between w-full">
          <div className="flex items-center gap-2 bg-slate-950/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/5 text-[11px] font-bold text-gray-300">
            <Compass className="w-3.5 h-3.5 text-emerald-400 animate-spin-slow" />
            <span>Interactive Eco-Radar Active</span>
          </div>
          <button 
            onClick={() => setRadarScanning(!radarScanning)}
            className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-all duration-300 ${
              radarScanning 
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" 
                : "bg-slate-900 text-gray-400 border-white/5 hover:bg-slate-800"
            }`}
          >
            {radarScanning ? "Pause Scan" : "Start Scan"}
          </button>
        </div>

        {/* Map coordinates watermarks */}
        <div className="z-10 flex justify-between items-end w-full text-[9px] font-mono text-gray-500 select-none pointer-events-none">
          <span>LAT: 28.6139° N / LONG: 77.2090° E</span>
          <span>GRID ZOOM: 100x RANGE: 5.0 KM</span>
        </div>
      </div>

      {/* Selected Location Card Display */}
      <div className="w-full lg:w-80 flex flex-col justify-center">
        {selectedLocation ? (
          <div className="glassmorphism rounded-3xl p-6 border border-emerald-500/20 shadow-xl shadow-emerald-950/20 animate-in fade-in slide-in-from-bottom-5 duration-300">
            <div className="flex justify-between items-start">
              <div>
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Verified Recycler
                </span>
                <h3 className="text-xl font-bold text-white mt-2 leading-tight">
                  {selectedLocation.businessName}
                </h3>
              </div>
              <div className="flex items-center gap-1 bg-amber-400/10 text-amber-400 px-2 py-0.5 rounded-lg border border-amber-400/20 text-xs font-bold">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>{selectedLocation.ratings}</span>
              </div>
            </div>

            <div className="mt-4 space-y-2.5 text-sm text-gray-300 border-y border-white/5 py-4">
              <div className="flex items-start gap-2">
                <Navigation className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <div className="font-semibold text-gray-200">{selectedLocation.distance} away</div>
                  <div className="text-xs text-gray-400 mt-0.5">{selectedLocation.address}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xs text-emerald-400 font-semibold">{selectedLocation.licenseNumber}</span>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xs text-gray-300">{selectedLocation.phone}</span>
              </div>
            </div>

            {/* Specialties */}
            <div className="mt-4">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wide">Specialist Services</div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {selectedLocation.services.slice(0, 3).map((serv, index) => (
                  <span key={index} className="text-[10px] bg-slate-900 border border-white/5 text-gray-300 px-2 py-1 rounded-md">
                    {serv}
                  </span>
                ))}
              </div>
            </div>

            {/* Interactive Actions */}
            <div className="grid grid-cols-2 gap-3 mt-6">
              <a
                href={`tel:${selectedLocation.phone}`}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/10 hover:border-emerald-500/30 text-xs font-bold text-white transition-colors bg-white/5 hover:bg-emerald-500/10"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Shop</span>
              </a>
              <a
                href={`https://wa.me/${selectedLocation.phone.replace(/[^0-9]/g, "")}?text=Hi,%20I%20am%20interested%20in%20recycling%20my%20e-waste%20with%20ScrapSense.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-xs font-bold text-slate-950 transition-colors shadow-lg shadow-emerald-500/25"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.705 1.457h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413" />
                </svg>
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        ) : (
          <div className="glassmorphism rounded-3xl p-8 border border-white/5 text-center flex flex-col items-center justify-center h-full min-h-[250px]">
            <Navigation className="w-10 h-10 text-emerald-500/40 animate-bounce mb-3" />
            <h3 className="text-lg font-bold text-white leading-snug">Select a Recycler</h3>
            <p className="text-xs text-gray-400 mt-1 max-w-[200px] mx-auto">
              Click any verified radar node on the map grid to view direct contact details, specialties, and distance calculations.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
