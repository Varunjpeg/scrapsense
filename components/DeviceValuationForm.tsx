"use client";

import React, { useState } from "react";
import { ArrowRight, ArrowLeft, RefreshCw, Cpu, Award, Zap, AlertTriangle, Compass, CheckCircle } from "lucide-react";
import { useApp, DeviceValuation } from "@/context/AppContext";

interface DeviceValuationFormProps {
  onSuccess: (deviceName: string, valuation: DeviceValuation) => void;
}

export default function DeviceValuationForm({ onSuccess }: DeviceValuationFormProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form State
  const [deviceName, setDeviceName] = useState("");
  const [age, setAge] = useState("1-2 Years");
  const [isFunctional, setIsFunctional] = useState(true);
  const [physicalCondition, setPhysicalCondition] = useState("Flawless");
  const [batteryCondition, setBatteryCondition] = useState("Good");
  const [screenCondition, setScreenCondition] = useState("Flawless");
  const [accessories, setAccessories] = useState<string[]>([]);

  // Result State
  const [result, setResult] = useState<DeviceValuation | null>(null);

  const toggleAccessory = (acc: string) => {
    setAccessories(prev =>
      prev.includes(acc) ? prev.filter(a => a !== acc) : [...prev, acc]
    );
  };

  const handleNext = () => {
    if (step === 1 && !deviceName.trim()) return;
    setStep(prev => prev + 1);
  };

  const handlePrev = () => {
    setStep(prev => prev - 1);
  };

  const calculateValuation = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/ai/valuation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deviceName,
          age,
          isFunctional,
          physicalCondition,
          batteryCondition,
          screenCondition,
          accessories
        })
      });

      const data = await response.json();
      if (data.success) {
        setResult(data.valuation);
        setStep(7); // Go to results screen
      }
    } catch (error) {
      console.error("Valuation failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto glassmorphism rounded-3xl p-8 border border-white/5 shadow-2xl relative overflow-hidden">
      {/* Decorative Grid Glow background */}
      <div className="absolute inset-0 eco-grid pointer-events-none opacity-20" />

      {/* Steps Indicator */}
      {step < 7 && (
        <div className="relative z-10 flex justify-between items-center mb-8 border-b border-white/5 pb-4">
          <div className="text-sm font-bold text-emerald-400">Step {step} of 6</div>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div
                key={i}
                className={`w-5 h-1 rounded-full transition-all duration-300 ${
                  i <= step ? "bg-emerald-500" : "bg-white/10"
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Step 1: Device Name Input */}
      {step === 1 && (
        <div className="relative z-10 space-y-6">
          <div>
            <h3 className="text-xl font-bold text-white leading-tight">What device are we recycling?</h3>
            <p className="text-xs text-gray-400 mt-1">Our AI detects category, weight yields, and market values instantly.</p>
          </div>
          <input
            type="text"
            value={deviceName}
            onChange={(e) => setDeviceName(e.target.value)}
            placeholder="e.g. iPhone 13 Pro Max, Dell XPS 15, iPad Air..."
            className="w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/40 text-sm shadow-inner"
          />
          <button
            onClick={handleNext}
            disabled={!deviceName.trim()}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:hover:bg-emerald-500 text-slate-950 font-bold transition-all shadow-lg shadow-emerald-500/15 cursor-pointer text-sm"
          >
            <span>Continue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Step 2: Device Age */}
      {step === 2 && (
        <div className="relative z-10 space-y-6">
          <div>
            <h3 className="text-xl font-bold text-white leading-tight">How old is the device?</h3>
            <p className="text-xs text-gray-400 mt-1">Age directly impacts PCB degradation and refurbish coefficients.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {["Under 6 Months", "6-12 Months", "1-2 Years", "Over 2 Years"].map(opt => (
              <button
                key={opt}
                onClick={() => { setAge(opt); handleNext(); }}
                className={`py-4 px-5 rounded-2xl border text-xs font-bold text-center transition-all ${
                  age === opt
                    ? "bg-emerald-500 border-white text-slate-950 shadow-md shadow-emerald-500/10"
                    : "bg-slate-950 border-white/5 text-gray-300 hover:border-white/10 hover:bg-white/5"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
          <button
            onClick={handlePrev}
            className="flex items-center justify-center gap-2 py-3 rounded-2xl border border-white/5 hover:border-white/15 text-xs text-gray-400 hover:text-white font-bold w-full transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Go Back</span>
          </button>
        </div>
      )}

      {/* Step 3: Operational Status */}
      {step === 3 && (
        <div className="relative z-10 space-y-6">
          <div>
            <h3 className="text-xl font-bold text-white leading-tight">Does it turn on?</h3>
            <p className="text-xs text-gray-400 mt-1">Functional motherboards are diverted to refurbishment, others to direct mining.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => { setIsFunctional(true); handleNext(); }}
              className={`py-5 px-5 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center justify-center gap-2 ${
                isFunctional
                  ? "bg-emerald-500 border-white text-slate-950 shadow-md"
                  : "bg-slate-950 border-white/5 text-gray-300 hover:bg-white/5"
              }`}
            >
              <Zap className="w-5 h-5" />
              <span>Yes, fully operational</span>
            </button>
            <button
              onClick={() => { setIsFunctional(false); handleNext(); }}
              className={`py-5 px-5 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center justify-center gap-2 ${
                !isFunctional
                  ? "bg-emerald-500 border-white text-slate-950 shadow-md"
                  : "bg-slate-950 border-white/5 text-gray-300 hover:bg-white/5"
              }`}
            >
              <AlertTriangle className="w-5 h-5" />
              <span>No, dead/faulty</span>
            </button>
          </div>
          <button
            onClick={handlePrev}
            className="flex items-center justify-center gap-2 py-3 rounded-2xl border border-white/5 hover:border-white/15 text-xs text-gray-400 hover:text-white font-bold w-full transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Go Back</span>
          </button>
        </div>
      )}

      {/* Step 4: Screen Condition */}
      {step === 4 && (
        <div className="relative z-10 space-y-6">
          <div>
            <h3 className="text-xl font-bold text-white leading-tight">Screen & Panel state?</h3>
            <p className="text-xs text-gray-400 mt-1">Cracked displays require polarizer replacement sheets.</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {["Flawless", "Scratchy", "Cracked"].map(opt => (
              <button
                key={opt}
                onClick={() => { setScreenCondition(opt); handleNext(); }}
                className={`py-4 px-4 rounded-xl border text-xs font-bold transition-all ${
                  screenCondition === opt
                    ? "bg-emerald-500 border-white text-slate-950 shadow-md"
                    : "bg-slate-950 border-white/5 text-gray-300 hover:bg-white/5"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
          <button
            onClick={handlePrev}
            className="flex items-center justify-center gap-2 py-3 rounded-2xl border border-white/5 hover:border-white/15 text-xs text-gray-400 hover:text-white font-bold w-full transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Go Back</span>
          </button>
        </div>
      )}

      {/* Step 5: Physical Condition */}
      {step === 5 && (
        <div className="relative z-10 space-y-6">
          <div>
            <h3 className="text-xl font-bold text-white leading-tight">Outer Body condition?</h3>
            <p className="text-xs text-gray-400 mt-1">Checks for chassis bends, metal integrity, and dents.</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {["Flawless", "Good", "Damaged"].map(opt => (
              <button
                key={opt}
                onClick={() => { setPhysicalCondition(opt); handleNext(); }}
                className={`py-4 px-4 rounded-xl border text-xs font-bold transition-all ${
                  physicalCondition === opt
                    ? "bg-emerald-500 border-white text-slate-950 shadow-md"
                    : "bg-slate-950 border-white/5 text-gray-300 hover:bg-white/5"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
          <button
            onClick={handlePrev}
            className="flex items-center justify-center gap-2 py-3 rounded-2xl border border-white/5 hover:border-white/15 text-xs text-gray-400 hover:text-white font-bold w-full transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Go Back</span>
          </button>
        </div>
      )}

      {/* Step 6: Accessories Checklist */}
      {step === 6 && (
        <div className="relative z-10 space-y-6">
          <div>
            <h3 className="text-xl font-bold text-white leading-tight">Select available accessories</h3>
            <p className="text-xs text-gray-400 mt-1">Each accessory slightly boosts resale index.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {["Original Box", "OEM Charger", "Earphones", "Valid Purchase Bill"].map(opt => {
              const isChecked = accessories.includes(opt);
              return (
                <button
                  key={opt}
                  onClick={() => toggleAccessory(opt)}
                  className={`py-4 px-5 rounded-2xl border text-xs font-bold text-left flex items-center justify-between transition-all ${
                    isChecked
                      ? "bg-emerald-500/10 border-emerald-500 text-emerald-400"
                      : "bg-slate-950 border-white/5 text-gray-300 hover:bg-white/5"
                  }`}
                >
                  <span>{opt}</span>
                  <div className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                    isChecked ? "bg-emerald-500 border-white text-slate-950" : "border-gray-500"
                  }`}>
                    {isChecked && <CheckCircle className="w-3 h-3 fill-current" />}
                  </div>
                </button>
              );
            })}
          </div>
          <div className="flex gap-4">
            <button
              onClick={handlePrev}
              className="flex items-center justify-center gap-2 py-3 rounded-2xl border border-white/5 hover:border-white/15 text-xs text-gray-400 hover:text-white font-bold w-1/3 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <button
              onClick={calculateValuation}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-all shadow-lg shadow-emerald-500/15 cursor-pointer text-xs"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>AI Valuation in progress...</span>
                </>
              ) : (
                <>
                  <Cpu className="w-4 h-4 animate-pulse" />
                  <span>Run AI Engine</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Step 7: Valuation Report Screens! */}
      {step === 7 && result && (
        <div className="relative z-10 space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="text-center">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase border ${
              result.canBeRefurbished
                ? "bg-emerald-500/10 border-emerald-500 text-emerald-400"
                : "bg-amber-500/10 border-amber-500 text-amber-400"
            }`}>
              <Award className="w-3 h-3" />
              <span>{result.canBeRefurbished ? "Highly Refurbishable" : "Best For Scrap Recycling"}</span>
            </span>
            <h3 className="text-2xl font-black text-white mt-3">{result.deviceName}</h3>
            <p className="text-[11px] text-gray-400 uppercase tracking-widest font-mono mt-0.5">{result.category}</p>
          </div>

          {/* Pricing Dials */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-950/80 border border-white/5 rounded-2xl p-5 text-center relative overflow-hidden group">
              {result.canBeRefurbished && (
                <div className="absolute top-0 right-0 bg-emerald-500 text-slate-950 text-[8px] font-extrabold px-2 py-0.5 rounded-bl-lg uppercase">
                  Recommend
                </div>
              )}
              <div className="text-xs text-gray-400 font-semibold">Refurbished Payout</div>
              <div className={`text-2xl font-black mt-2 tracking-tight ${result.canBeRefurbished ? "text-emerald-400" : "text-gray-500"}`}>
                ₹{result.resaleValue.toLocaleString()}
              </div>
              <p className="text-[10px] text-gray-500 mt-1">Value if cleaned and components upgraded.</p>
            </div>
            
            <div className="bg-slate-950/80 border border-white/5 rounded-2xl p-5 text-center relative overflow-hidden">
              {!result.canBeRefurbished && (
                <div className="absolute top-0 right-0 bg-amber-500 text-slate-950 text-[8px] font-extrabold px-2 py-0.5 rounded-bl-lg uppercase">
                  Recommend
                </div>
              )}
              <div className="text-xs text-gray-400 font-semibold">Direct Scrap Payout</div>
              <div className={`text-2xl font-black mt-2 tracking-tight ${!result.canBeRefurbished ? "text-amber-400" : "text-gray-400"}`}>
                ₹{result.scrapValue.toLocaleString()}
              </div>
              <p className="text-[10px] text-gray-500 mt-1">Raw material melting recovery payout.</p>
            </div>
          </div>

          {/* Urban Mining Yields Indicator */}
          <div className="bg-emerald-950/20 border border-emerald-500/10 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Compass className="w-4 h-4 text-emerald-400 animate-spin-slow" />
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Simulated Urban Mining yields</h4>
            </div>
            <div className="grid grid-cols-5 gap-2 text-center">
              {[
                { name: "Gold", val: `${result.miningYield.gold}g`, color: "text-amber-400" },
                { name: "Copper", val: `${result.miningYield.copper}g`, color: "text-orange-400" },
                { name: "Silver", val: `${result.miningYield.silver}g`, color: "text-gray-300" },
                { name: "Silicon", val: `${result.miningYield.silicon}g`, color: "text-indigo-400" },
                { name: "Plastics", val: `${result.miningYield.plastics}g`, color: "text-teal-400" }
              ].map(el => (
                <div key={el.name} className="bg-slate-950/60 p-2.5 rounded-xl border border-white/5">
                  <div className={`text-xs font-bold ${el.color}`}>{el.val}</div>
                  <div className="text-[9px] text-gray-500 font-bold uppercase mt-1">{el.name}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Trigger proceed */}
          <div className="flex gap-4">
            <button
              onClick={() => { setStep(1); setResult(null); }}
              className="py-3 px-4 rounded-2xl border border-white/5 hover:border-white/10 text-xs text-gray-400 hover:text-white font-bold transition-colors cursor-pointer"
            >
              Re-Calculate
            </button>
            <button
              onClick={() => onSuccess(deviceName, result)}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-all shadow-lg shadow-emerald-500/25 cursor-pointer text-xs"
            >
              <span>Lock Price & Proceed</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
