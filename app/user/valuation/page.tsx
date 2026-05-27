"use client";

import React, { useState } from "react";
import { BadgeDollarSign, Camera, Keyboard, CheckCircle, Navigation, Clock, ShieldCheck, Heart } from "lucide-react";
import DeviceValuationForm from "@/components/DeviceValuationForm";
import DeviceCameraUpload from "@/components/DeviceCameraUpload";
import { useApp, DeviceValuation, Booking } from "@/context/AppContext";

export default function ValuationCenter() {
  const { user, dealers, refurbishers, createBooking } = useApp();

  const [activeTab, setActiveTab] = useState<"manual" | "photo">("manual");
  const [currentStep, setCurrentStep] = useState<"valuation" | "booking" | "success">("valuation");

  // State from successful valuation
  const [deviceName, setDeviceName] = useState("");
  const [valuationData, setValuationData] = useState<DeviceValuation | null>(null);

  // Booking Form State
  const [pickupAddress, setPickupAddress] = useState(user?.savedLocations[0] || "");
  const [contactPhone, setContactPhone] = useState("+91 99999 11111");
  const [timeSlot, setTimeSlot] = useState("10:00 AM - 01:00 PM");
  const [selectedPartnerId, setSelectedPartnerId] = useState("");

  const [bookedResult, setBookedResult] = useState<Booking | null>(null);

  const handleValuationSuccess = (name: string, data: DeviceValuation) => {
    setDeviceName(name);
    setValuationData(data);
    
    // Choose first eligible partner automatically depending on canBeRefurbished!
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
    <div className="space-y-8 max-w-4xl mx-auto">
      
      {/* VALUATION INTERFACE */}
      {currentStep === "valuation" && (
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-black text-white leading-none">Get Exact Amount For Your Device</h2>
            <p className="text-xs text-gray-400 max-w-md mx-auto">
              India's smartest automated hardware diagnostics. Evaluate old phones, laptops, and smartwatches in seconds.
            </p>

            {/* Toggle Tabs */}
            <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-white/5 max-w-sm mx-auto mt-6">
              <button
                onClick={() => setActiveTab("manual")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "manual"
                    ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/10"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Keyboard className="w-3.5 h-3.5" />
                <span>Search Manually</span>
              </button>
              <button
                onClick={() => setActiveTab("photo")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "photo"
                    ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/10"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Scan With Photo</span>
              </button>
            </div>
          </div>

          <div className="mt-8">
            {activeTab === "manual" ? (
              <DeviceValuationForm onSuccess={handleValuationSuccess} />
            ) : (
              <DeviceCameraUpload onSuccess={handleValuationSuccess} />
            )}
          </div>
        </div>
      )}

      {/* BOOKING PORTAL SCREEN */}
      {currentStep === "booking" && valuationData && (
        <div className="glassmorphism rounded-3xl p-8 border border-emerald-500/20 shadow-2xl relative overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="absolute inset-0 eco-grid pointer-events-none opacity-20" />
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between border-b border-white/5 pb-6 mb-6 gap-4">
            <div>
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Price Locked Guarantee
              </span>
              <h3 className="text-2xl font-black text-white mt-2 leading-none">{deviceName}</h3>
              <p className="text-xs text-emerald-400 font-bold mt-1 uppercase tracking-wide">
                Locked Value: ₹{(valuationData.canBeRefurbished ? valuationData.resaleValue : valuationData.scrapValue).toLocaleString()}
              </p>
            </div>
            
            <div className="bg-slate-950/80 px-4 py-2.5 rounded-xl border border-white/5 text-left md:text-right w-fit shrink-0">
              <div className="text-[10px] text-gray-500 font-bold uppercase">Carbon offset yield</div>
              <div className="text-sm font-extrabold text-white mt-0.5">+{valuationData.canBeRefurbished ? 24 : 15} kg CO₂ saved</div>
            </div>
          </div>

          <form onSubmit={handleBookingSubmit} className="relative z-10 space-y-6">
            
            {/* Address */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Doorstep Pickup Address</label>
              <div className="relative">
                <Navigation className="absolute left-4 top-3.5 w-4 h-4 text-emerald-400" />
                <input
                  type="text"
                  required
                  value={pickupAddress}
                  onChange={(e) => setPickupAddress(e.target.value)}
                  placeholder="Street name, Appt number, City..."
                  className="w-full bg-slate-950 border border-white/5 rounded-xl pl-11 pr-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500/40"
                />
              </div>
            </div>

            {/* Grid fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Phone */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Contact Phone</label>
                <input
                  type="text"
                  required
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500/40"
                />
              </div>

              {/* Time slots */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Preferred Slot</label>
                <div className="relative">
                  <Clock className="absolute left-4 top-3.5 w-4 h-4 text-gray-500" />
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full bg-slate-950 border border-white/5 rounded-xl pl-11 pr-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500/40 appearance-none"
                  >
                    <option>10:00 AM - 01:00 PM</option>
                    <option>02:00 PM - 05:00 PM</option>
                    <option>06:00 PM - 08:00 PM</option>
                  </select>
                </div>
              </div>

            </div>

            {/* Recycler Picker Selection depending on state */}
            <div className="space-y-2 border-t border-white/5 pt-6">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">
                Select {valuationData.canBeRefurbished ? "Refurbisher" : "Scrap Dealer"}
              </label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(valuationData.canBeRefurbished ? refurbishers : dealers).map(partner => (
                  <button
                    key={partner.id}
                    type="button"
                    onClick={() => setSelectedPartnerId(partner.id)}
                    className={`p-4 rounded-2xl border text-left flex items-start justify-between transition-all ${
                      selectedPartnerId === partner.id
                        ? "bg-emerald-500/10 border-emerald-500 text-emerald-400"
                        : "bg-slate-950 border-white/5 text-gray-300 hover:bg-white/5"
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-white leading-snug">{partner.businessName}</div>
                      <div className="text-[10px] text-gray-500 mt-1">{partner.distance} away • ★{partner.ratings}</div>
                    </div>
                    <div className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center shrink-0 ${
                      selectedPartnerId === partner.id ? "border-emerald-400 bg-emerald-500 text-slate-950" : "border-gray-500"
                    }`}>
                      {selectedPartnerId === partner.id && <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit book */}
            <div className="flex gap-4 border-t border-white/5 pt-6">
              <button
                type="button"
                onClick={() => setCurrentStep("valuation")}
                className="py-3 px-4 rounded-xl border border-white/5 hover:border-white/10 text-xs text-gray-400 hover:text-white font-bold transition-all cursor-pointer"
              >
                Cancel Booking
              </button>
              
              <button
                type="submit"
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black transition-all shadow-lg shadow-emerald-500/25 cursor-pointer text-xs"
              >
                <span>Confirm Pickup Request</span>
                <CheckCircle className="w-4 h-4" />
              </button>
            </div>

          </form>
        </div>
      )}

      {/* BOOKING SUCCESS SCREEN */}
      {currentStep === "success" && bookedResult && (
        <div className="glassmorphism rounded-3xl p-10 border border-emerald-500/40 text-center max-w-xl mx-auto shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-300">
          <div className="absolute inset-0 eco-grid pointer-events-none opacity-20" />
          
          <div className="relative z-10 flex flex-col items-center">
            
            <div className="p-4 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-6 animate-bounce">
              <CheckCircle className="w-12 h-12" />
            </div>

            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
              Booking Confirmed
            </span>

            <h3 className="text-2xl font-black text-white mt-4 leading-none">Doorstep Pickup Scheduled!</h3>
            <p className="text-xs text-gray-400 max-w-xs mx-auto mt-2 leading-relaxed">
              We have locked in your payout amount. An agent from <span className="text-white font-semibold">{bookedResult.recyclerName}</span> will arrive shortly.
            </p>

            <div className="w-full border-t border-white/5 my-6 py-6 text-left text-xs text-gray-300 space-y-2 max-w-sm mx-auto">
              <div className="flex justify-between">
                <span className="text-gray-500 font-bold uppercase">Booking ID</span>
                <span className="font-mono font-bold text-white">{bookedResult.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-bold uppercase">Locked Payout</span>
                <span className="font-extrabold text-emerald-400">₹{bookedResult.price.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-bold uppercase">Carbon Saved</span>
                <span className="font-bold text-white">+{bookedResult.valuation.canBeRefurbished ? 24 : 15} kg CO₂</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-bold uppercase">Scheduled Time</span>
                <span className="font-bold text-white">{bookedResult.timeSlot}</span>
              </div>
            </div>

            <button
              onClick={() => { setCurrentStep("valuation"); setValuationData(null); }}
              className="py-3 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black transition-all shadow-md shadow-emerald-500/15 cursor-pointer text-xs"
            >
              Recycle Another Device
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
