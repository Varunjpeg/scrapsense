"use client";

import React, { useState } from "react";
import { BadgeDollarSign, Camera, Keyboard, CheckCircle, Navigation, Clock, ShieldCheck, Heart, Leaf, Award } from "lucide-react";
import DeviceValuationForm from "@/components/DeviceValuationForm";
import DeviceCameraUpload from "@/components/DeviceCameraUpload";
import { useApp, DeviceValuation, Booking } from "@/context/AppContext";

export default function ValuationCenter() {
  const { user, dealers, refurbishers, createBooking } = useApp();

  const [activeTab, setActiveTab] = useState<"manual" | "photo">("manual");
  const [currentStep, setCurrentStep] = useState<"valuation" | "booking" | "success">("valuation");

  // Valuation parameters
  const [deviceName, setDeviceName] = useState("");
  const [valuationData, setValuationData] = useState<DeviceValuation | null>(null);

  // Booking details
  const [pickupAddress, setPickupAddress] = useState(user?.savedLocations[0] || "");
  const [contactPhone, setContactPhone] = useState("+91 99999 11111");
  const [timeSlot, setTimeSlot] = useState("10:00 AM - 01:00 PM");
  const [selectedPartnerId, setSelectedPartnerId] = useState("");

  const [bookedResult, setBookedResult] = useState<Booking | null>(null);

  const handleValuationSuccess = (name: string, data: DeviceValuation) => {
    setDeviceName(name);
    setValuationData(data);
    
    const partnerList = data.canBeRefurbished ? refurbishers : dealers;
    setSelectedPartnerId(partnerList[0]?.id || "");
    
    setCurrentStep("booking");
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valuationData || !pickupAddress || !contactPhone || !selectedPartnerId) return;

    const result = createBooking(
      deviceName,
      valuationData,
      pickupAddress,
      contactPhone,
      timeSlot,
      selectedPartnerId,
      valuationData.canBeRefurbished
    );

    setBookedResult(result);
    setCurrentStep("success");
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto text-left">
      
      {/* VALUATION INTERFACE */}
      {currentStep === "valuation" && (
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-black text-foreground leading-none">AI E-Waste Valuation Center</h2>
            <p className="text-xs text-muted-text max-w-md mx-auto leading-relaxed">
              Google Gemini Vision evaluates device physical conditions to calculate metal scrap weights and locked cash values.
            </p>

            {/* Toggle Tabs */}
            <div className="flex bg-card p-1 border border-card-border rounded-full max-w-xs mx-auto mt-5">
              <button
                onClick={() => setActiveTab("manual")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "manual"
                    ? "bg-emerald-500 text-slate-950 shadow"
                    : "text-muted-text hover:text-foreground"
                }`}
              >
                <Keyboard className="w-3.5 h-3.5" />
                <span>Manual search</span>
              </button>
              <button
                onClick={() => setActiveTab("photo")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "photo"
                    ? "bg-emerald-500 text-slate-950 shadow"
                    : "text-muted-text hover:text-foreground"
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Gemini scan</span>
              </button>
            </div>
          </div>

          <div className="mt-6">
            {activeTab === "manual" ? (
              <DeviceValuationForm onSuccess={handleValuationSuccess} />
            ) : (
              <DeviceCameraUpload onSuccess={handleValuationSuccess} />
            )}
          </div>
        </div>
      )}

      {/* BOOKING PANEL */}
      {currentStep === "booking" && valuationData && (
        <div className="glassmorphism rounded-2xl p-6.5 border border-card-border bg-card shadow-lg relative overflow-hidden animate-in fade-in duration-200">
          <div className="absolute inset-0 eco-grid pointer-events-none opacity-20" />
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between border-b border-card-border pb-5 mb-5 gap-4">
            <div>
              <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[8px] font-extrabold px-2 py-0.5 rounded uppercase font-mono">
                Price Locked Guarantee
              </span>
              <h3 className="text-lg font-black text-foreground mt-2 leading-none">{deviceName}</h3>
              <p className="text-xs text-emerald-500 font-extrabold mt-1">
                Locked Payout Value: ₹{(valuationData.canBeRefurbished ? valuationData.resaleValue : valuationData.scrapValue).toLocaleString()}
              </p>
            </div>
            
            <div className="bg-background px-4 py-2.5 rounded-xl border border-card-border text-left md:text-right w-fit shrink-0">
              <div className="text-[9px] text-muted-text font-bold uppercase tracking-wider font-mono">Sustainability index</div>
              <div className="text-xs font-bold text-foreground mt-0.5">+{valuationData.co2SavedKg} kg carbon diverted</div>
            </div>
          </div>

          <form onSubmit={handleBookingSubmit} className="relative z-10 space-y-5">
            
            {/* Address */}
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-muted-text uppercase tracking-wider ml-1">Doorstep Pickup Address</label>
              <div className="relative">
                <Navigation className="absolute left-3.5 top-3.5 w-4 h-4 text-emerald-500" />
                <input
                  type="text"
                  required
                  value={pickupAddress}
                  onChange={(e) => setPickupAddress(e.target.value)}
                  placeholder="Street name, Appt number, City..."
                  className="w-full bg-background border border-card-border rounded-xl pl-10 pr-4 py-3 text-xs text-foreground focus:outline-none focus:border-emerald-500/40"
                />
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5.5">
              
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-muted-text uppercase tracking-wider ml-1">Contact Phone</label>
                <input
                  type="text"
                  required
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full bg-background border border-card-border rounded-xl px-3.5 py-3 text-xs text-foreground focus:outline-none focus:border-emerald-500/40"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-muted-text uppercase tracking-wider ml-1">Preferred Slot</label>
                <div className="relative">
                  <Clock className="absolute left-3.5 top-3.5 w-4 h-4 text-muted-text" />
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full bg-background border border-card-border rounded-xl pl-10 pr-4 py-3 text-xs text-foreground focus:outline-none focus:border-emerald-500/40 appearance-none"
                  >
                    <option>10:00 AM - 01:00 PM</option>
                    <option>02:00 PM - 05:00 PM</option>
                    <option>06:00 PM - 08:00 PM</option>
                  </select>
                </div>
              </div>

            </div>

            {/* Recyclers selector */}
            <div className="space-y-2 border-t border-card-border pt-5">
              <label className="text-[9px] font-bold text-muted-text uppercase tracking-wider ml-1">
                Select verified e-waste {valuationData.canBeRefurbished ? "refurbisher" : "recycler"}
              </label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {(valuationData.canBeRefurbished ? refurbishers : dealers).map(partner => (
                  <button
                    key={partner.id}
                    type="button"
                    onClick={() => setSelectedPartnerId(partner.id)}
                    className={`p-3.5 rounded-xl border text-left flex items-start justify-between transition-all ${
                      selectedPartnerId === partner.id
                        ? "bg-emerald-500/10 border-emerald-500 text-emerald-500"
                        : "bg-background border-card-border text-foreground hover:bg-muted-border"
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-foreground leading-snug">{partner.businessName}</div>
                      <div className="text-[10px] text-muted-text mt-1 font-medium font-mono">{partner.distance} away • ★{partner.ratings} Rating</div>
                    </div>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                      selectedPartnerId === partner.id ? "border-emerald-500 bg-emerald-500 text-slate-950" : "border-gray-400"
                    }`}>
                      {selectedPartnerId === partner.id && <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Book submit actions */}
            <div className="flex gap-3 border-t border-card-border pt-5">
              <button
                type="button"
                onClick={() => setCurrentStep("valuation")}
                className="py-3 px-4 rounded-xl border border-card-border text-xs text-gray-500 hover:text-foreground transition-all cursor-pointer font-bold"
              >
                Back to valuation
              </button>
              
              <button
                type="submit"
                className="flex-1 py-3 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black transition-all shadow cursor-pointer text-xs flex items-center justify-center gap-1.5"
              >
                <span>Confirm Pickup & Lock Payout</span>
                <CheckCircle className="w-4.5 h-4.5" />
              </button>
            </div>

          </form>
        </div>
      )}

      {/* BOOKING SUCCESS SCREEN */}
      {currentStep === "success" && bookedResult && (
        <div className="glassmorphism rounded-2xl p-8 border border-emerald-500/30 text-center max-w-lg mx-auto shadow-lg relative overflow-hidden animate-in fade-in duration-300">
          <div className="absolute inset-0 eco-grid pointer-events-none opacity-20" />
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="p-3 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 mb-5 animate-pulse">
              <CheckCircle className="w-10 h-10" />
            </div>

            <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[9px] font-extrabold px-2.5 py-0.5 rounded uppercase font-mono">
              Booking Confirmed
            </span>

            <h3 className="text-xl font-black text-foreground mt-3">Doorstep Pickup Scheduled</h3>
            <p className="text-xs text-muted-text max-w-xs mx-auto mt-1 leading-normal">
              An inspector from <span className="text-foreground font-semibold">{bookedResult.recyclerName}</span> is assigned to verify the device diagnostic profile.
            </p>

            <div className="w-full border-t border-card-border my-5 py-5 text-left text-xs text-foreground space-y-2 max-w-xs mx-auto font-medium">
              <div className="flex justify-between">
                <span className="text-muted-text font-bold uppercase font-mono text-[9px]">Booking ID</span>
                <span className="font-mono text-foreground font-bold">{bookedResult.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-text font-bold uppercase font-mono text-[9px]">Locked Worth</span>
                <span className="font-extrabold text-emerald-500">₹{bookedResult.price.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-text font-bold uppercase font-mono text-[9px]">Carbon Offset</span>
                <span className="font-bold text-foreground">+{bookedResult.valuation.co2SavedKg} kg CO₂</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-text font-bold uppercase font-mono text-[9px]">Pickup Slot</span>
                <span className="font-bold text-foreground">{bookedResult.timeSlot}</span>
              </div>
            </div>

            <button
              onClick={() => { setCurrentStep("valuation"); setValuationData(null); }}
              className="py-2.5 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-all shadow cursor-pointer text-xs"
            >
              Divert another device
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
