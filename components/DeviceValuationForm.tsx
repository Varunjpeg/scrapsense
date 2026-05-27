"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  ArrowRight, ArrowLeft, RefreshCw, Cpu, Award, Zap, AlertTriangle, Compass, CheckCircle, 
  Search, Keyboard, Laptop, Smartphone, Gamepad2, Layers, Tv, History
} from "lucide-react";
import { useApp, DeviceValuation } from "@/context/AppContext";

interface DeviceValuationFormProps {
  onSuccess: (deviceName: string, valuation: DeviceValuation) => void;
}

interface SuggestionItem {
  name: string;
  category: string;
  icon: any;
}

const CATEGORIZED_SUGGESTIONS: SuggestionItem[] = [
  // Laptops
  { name: "Apple MacBook Pro M1", category: "Laptops", icon: Laptop },
  { name: "Apple MacBook Air M2", category: "Laptops", icon: Laptop },
  { name: "Dell XPS 15", category: "Laptops", icon: Laptop },
  { name: "Lenovo ThinkPad X1 Carbon", category: "Laptops", icon: Laptop },
  { name: "HP Spectre x360", category: "Laptops", icon: Laptop },
  // Smartphones
  { name: "Apple iPhone 15 Pro Max", category: "Smartphones", icon: Smartphone },
  { name: "Samsung Galaxy S24 Ultra", category: "Smartphones", icon: Smartphone },
  { name: "OnePlus 12", category: "Smartphones", icon: Smartphone },
  { name: "Google Pixel 8 Pro", category: "Smartphones", icon: Smartphone },
  // Consoles
  { name: "Sony PlayStation 5", category: "Gaming Consoles", icon: Gamepad2 },
  { name: "Microsoft Xbox Series X", category: "Gaming Consoles", icon: Gamepad2 },
  { name: "Nintendo Switch OLED", category: "Gaming Consoles", icon: Gamepad2 },
  // PC Components
  { name: "NVIDIA GeForce RTX 4090", category: "PC Components", icon: Layers },
  { name: "Intel Core i9-14900K", category: "PC Components", icon: Layers },
  { name: "Corsair Vengeance 32GB DDR5", category: "PC Components", icon: Layers },
  { name: "ASUS ROG Motherboard Z790", category: "PC Components", icon: Layers },
  // Household Electronics
  { name: "Sony Bravia Smart TV 55\"", category: "Household Electronics", icon: Tv },
  { name: "Dyson V15 Vacuum Cleaner", category: "Household Electronics", icon: Tv }
];

export default function DeviceValuationForm({ onSuccess }: DeviceValuationFormProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form states
  const [deviceName, setDeviceName] = useState("");
  const [age, setAge] = useState("1-2 Years");
  const [isFunctional, setIsFunctional] = useState(true);
  const [physicalCondition, setPhysicalCondition] = useState("Good");
  const [batteryCondition, setBatteryCondition] = useState("Good");
  const [screenCondition, setScreenCondition] = useState("Good");
  const [accessories, setAccessories] = useState<string[]>([]);

  // Search & Autocomplete
  const [query, setQuery] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState<SuggestionItem[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Results
  const [result, setResult] = useState<DeviceValuation | null>(null);

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem("scrapsense_recent_searches");
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Handle clicking outside dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const saveRecentSearch = (name: string) => {
    const updated = [name, ...recentSearches.filter(s => s !== name)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("scrapsense_recent_searches", JSON.stringify(updated));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setDeviceName(val);

    if (val.trim().length > 0) {
      const filtered = CATEGORIZED_SUGGESTIONS.filter(item =>
        item.name.toLowerCase().includes(val.toLowerCase()) ||
        item.category.toLowerCase().includes(val.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowDropdown(true);
      setHighlightedIndex(-1);
    } else {
      setFilteredSuggestions([]);
      setShowDropdown(false);
    }
  };

  const selectSuggestion = (name: string) => {
    setQuery(name);
    setDeviceName(name);
    setShowDropdown(false);
    saveRecentSearch(name);
    setStep(2); // Go directly to next step on select!
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex(prev => 
        prev < filteredSuggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex(prev => 
        prev > 0 ? prev - 1 : filteredSuggestions.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < filteredSuggestions.length) {
        selectSuggestion(filteredSuggestions[highlightedIndex].name);
      } else if (query.trim().length > 0) {
        selectSuggestion(query);
      }
    } else if (e.key === "Escape") {
      setShowDropdown(false);
    }
  };

  const toggleAccessory = (acc: string) => {
    setAccessories(prev =>
      prev.includes(acc) ? prev.filter(a => a !== acc) : [...prev, acc]
    );
  };

  const handleNext = () => {
    if (step === 1 && !deviceName.trim()) return;
    if (step === 1) {
      saveRecentSearch(deviceName);
    }
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
        setStep(7); // Show result
      }
    } catch (error) {
      console.error("Valuation call failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto glassmorphism rounded-2xl p-6.5 border border-card-border bg-card shadow relative overflow-hidden text-left">
      <div className="absolute inset-0 eco-grid pointer-events-none opacity-20" />

      {/* Header index */}
      {step < 7 && (
        <div className="relative z-10 flex justify-between items-center mb-6 border-b border-card-border pb-3">
          <div className="text-xs font-bold text-emerald-500 flex items-center gap-1.5 font-mono">
            <Keyboard className="w-3.5 h-3.5" />
            <span>DIAGNOSTICS STEP {step} OF 6</span>
          </div>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div
                key={i}
                className={`w-4 h-1 rounded-full transition-all duration-300 ${
                  i <= step ? "bg-emerald-500" : "bg-card-border"
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* STEP 1: Search Auto-complete input */}
      {step === 1 && (
        <div className="relative z-10 space-y-5">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-foreground">Select device model</h3>
            <p className="text-[11px] text-muted-text">Type your model or select from standard options below.</p>
          </div>

          <div className="relative" ref={dropdownRef}>
            <div className="relative">
              <Search className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-muted-text" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onFocus={() => query.trim().length > 0 && setShowDropdown(true)}
                placeholder="e.g. MacBook Pro M1, iPhone 15 Pro..."
                className="w-full bg-background border border-card-border rounded-xl pl-11 pr-4 py-3 text-xs text-foreground focus:outline-none focus:border-emerald-500/50 shadow-inner"
              />
            </div>

            {/* Auto-complete suggestions dropdown */}
            {showDropdown && filteredSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-card-border rounded-xl shadow-xl z-30 max-h-60 overflow-y-auto p-1.5 space-y-1">
                {filteredSuggestions.map((item, index) => {
                  const SugIcon = item.icon;
                  const isHighlighted = highlightedIndex === index;
                  return (
                    <button
                      key={index}
                      onClick={() => selectSuggestion(item.name)}
                      className={`w-full text-left flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                        isHighlighted 
                          ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" 
                          : "text-foreground hover:bg-muted-border border border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <SugIcon className="w-4 h-4 text-muted-text shrink-0" />
                        <span>{item.name}</span>
                      </div>
                      <span className="text-[9px] font-bold text-muted-text uppercase font-mono">{item.category}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="space-y-1.5 pt-1">
              <span className="text-[9px] font-bold text-muted-text uppercase tracking-wider flex items-center gap-1">
                <History className="w-3 h-3" />
                <span>Recent Searches</span>
              </span>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map(s => (
                  <button
                    key={s}
                    onClick={() => { setQuery(s); setDeviceName(s); }}
                    className="text-[10px] bg-muted-border border border-card-border hover:border-emerald-500/20 hover:text-emerald-500 text-foreground px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Categorized standard lists */}
          <div className="space-y-2 border-t border-card-border pt-4">
            <span className="text-[9px] font-bold text-muted-text uppercase tracking-wider">Device Segments</span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { name: "iPhone 15 Pro", icon: Smartphone },
                { name: "MacBook Pro M1", icon: Laptop },
                { name: "PlayStation 5", icon: Gamepad2 },
                { name: "GeForce RTX 4090", icon: Layers },
                { name: "ASUS Motherboard", icon: Layers },
                { name: "Sony Smart TV", icon: Tv }
              ].map(el => {
                const ElIcon = el.icon;
                return (
                  <button
                    key={el.name}
                    onClick={() => { setQuery(el.name); setDeviceName(el.name); }}
                    className="flex items-center gap-2 p-2.5 bg-muted-border border border-card-border hover:border-emerald-500/30 rounded-xl text-[10px] font-semibold text-foreground transition-all text-left"
                  >
                    <ElIcon className="w-3.5 h-3.5 text-muted-text" />
                    <span className="truncate">{el.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={handleNext}
            disabled={!deviceName.trim()}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:hover:bg-emerald-500 text-slate-950 font-bold transition-all cursor-pointer text-xs"
          >
            <span>Lock Specifications & Continue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* STEP 2: Age */}
      {step === 2 && (
        <div className="relative z-10 space-y-5">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-foreground">Device Age</h3>
            <p className="text-[11px] text-muted-text font-medium">Internal chipsets degrade progressively over years.</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {["Under 6 Months", "6-12 Months", "1-2 Years", "Over 2 Years"].map(opt => (
              <button
                key={opt}
                onClick={() => { setAge(opt); handleNext(); }}
                className={`py-3.5 px-4 rounded-xl border text-xs font-bold text-center transition-all ${
                  age === opt
                    ? "bg-emerald-500 border-emerald-500 text-slate-950"
                    : "bg-background border-card-border text-foreground hover:bg-muted-border"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
          <button onClick={handlePrev} className="text-xs text-gray-500 hover:text-foreground font-bold w-full text-center">
            Go Back
          </button>
        </div>
      )}

      {/* STEP 3: Functional */}
      {step === 3 && (
        <div className="relative z-10 space-y-5">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-foreground">Power state</h3>
            <p className="text-[11px] text-muted-text">Functional models are refurbished, non-functional go directly to melting recovery.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => { setIsFunctional(true); handleNext(); }}
              className={`py-5 px-4 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center gap-2 ${
                isFunctional
                  ? "bg-emerald-500 border-emerald-500 text-slate-950"
                  : "bg-background border-card-border text-foreground hover:bg-muted-border"
              }`}
            >
              <Zap className="w-5 h-5" />
              <span>Powers on fully</span>
            </button>
            <button
              onClick={() => { setIsFunctional(false); handleNext(); }}
              className={`py-5 px-4 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center gap-2 ${
                !isFunctional
                  ? "bg-emerald-500 border-emerald-500 text-slate-950"
                  : "bg-background border-card-border text-foreground hover:bg-muted-border"
              }`}
            >
              <AlertTriangle className="w-5 h-5" />
              <span>Dead / Faulty motherboard</span>
            </button>
          </div>
          <button onClick={handlePrev} className="text-xs text-gray-500 hover:text-foreground font-bold w-full text-center">
            Go Back
          </button>
        </div>
      )}

      {/* STEP 4: Screen */}
      {step === 4 && (
        <div className="relative z-10 space-y-5">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-foreground">Screen Display glass</h3>
            <p className="text-[11px] text-muted-text">Polished glass segment indexes.</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {["Flawless", "Scratchy", "Cracked"].map(opt => (
              <button
                key={opt}
                onClick={() => { setScreenCondition(opt); handleNext(); }}
                className={`py-3.5 px-3 rounded-xl border text-xs font-bold transition-all ${
                  screenCondition === opt
                    ? "bg-emerald-500 border-emerald-500 text-slate-950"
                    : "bg-background border-card-border text-foreground hover:bg-muted-border"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
          <button onClick={handlePrev} className="text-xs text-gray-500 hover:text-foreground font-bold w-full text-center">
            Go Back
          </button>
        </div>
      )}

      {/* STEP 5: Physical */}
      {step === 5 && (
        <div className="relative z-10 space-y-5">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-foreground">Chassis Physical Body</h3>
            <p className="text-[11px] text-muted-text font-medium">Bents or motherboard casing damages drop coefficients.</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {["Flawless", "Good", "Damaged"].map(opt => (
              <button
                key={opt}
                onClick={() => { setPhysicalCondition(opt); handleNext(); }}
                className={`py-3.5 px-3 rounded-xl border text-xs font-bold transition-all ${
                  physicalCondition === opt
                    ? "bg-emerald-500 border-emerald-500 text-slate-950"
                    : "bg-background border-card-border text-foreground hover:bg-muted-border"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
          <button onClick={handlePrev} className="text-xs text-gray-500 hover:text-foreground font-bold w-full text-center">
            Go Back
          </button>
        </div>
      )}

      {/* STEP 6: Accessories Checklist */}
      {step === 6 && (
        <div className="relative z-10 space-y-5">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-foreground">Accessories Checklist</h3>
            <p className="text-[11px] text-muted-text">Original cables slightly increase secondary retail value.</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {["Original Box", "OEM Charger", "Earphones", "Purchase Bill"].map(opt => {
              const isChecked = accessories.includes(opt);
              return (
                <button
                  key={opt}
                  onClick={() => toggleAccessory(opt)}
                  className={`py-3.5 px-4 rounded-xl border text-xs font-bold flex items-center justify-between transition-all ${
                    isChecked
                      ? "bg-emerald-500/10 border-emerald-500 text-emerald-500"
                      : "bg-background border-card-border text-foreground hover:bg-muted-border"
                  }`}
                >
                  <span>{opt}</span>
                  <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                    isChecked ? "bg-emerald-500 border-emerald-500 text-slate-950" : "border-gray-400"
                  }`}>
                    {isChecked && <span>✓</span>}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex gap-3 pt-3 border-t border-card-border">
            <button
              onClick={handlePrev}
              className="py-3 px-4 rounded-xl border border-card-border text-xs font-bold text-gray-500 hover:text-foreground"
            >
              Back
            </button>
            <button
              onClick={calculateValuation}
              disabled={loading}
              className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Analyzing parameters...</span>
                </>
              ) : (
                <>
                  <Cpu className="w-4 h-4" />
                  <span>Execute Heuristics</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* STEP 7: STRIPE-STYLE DATA REPORT */}
      {step === 7 && result && (
        <div className="relative z-10 space-y-6 animate-in fade-in duration-300">
          <div className="text-center pb-4 border-b border-card-border">
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[9px] font-extrabold uppercase border ${
              result.canBeRefurbished
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                : "bg-amber-500/10 border-amber-500/20 text-amber-500"
            }`}>
              {result.canBeRefurbished ? "Highly Refurbishable" : "Best For Material Scrap"}
            </span>
            <h3 className="text-xl font-black text-foreground mt-2 leading-none">{result.deviceName}</h3>
            <p className="text-[10px] text-muted-text font-bold uppercase tracking-wider font-mono mt-1">{result.category}</p>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="border border-card-border bg-background p-4 rounded-xl relative">
              <span className="text-[10px] text-muted-text font-bold uppercase tracking-wider">Refurbished Payout</span>
              <div className={`text-xl font-extrabold mt-1.5 ${result.canBeRefurbished ? "text-emerald-500" : "text-muted-text"}`}>
                ₹{result.resaleValue.toLocaleString()}
              </div>
              <p className="text-[10px] text-muted-text mt-1">Value if repaired and chips cleaned.</p>
            </div>
            
            <div className="border border-card-border bg-background p-4 rounded-xl">
              <span className="text-[10px] text-muted-text font-bold uppercase tracking-wider">Direct Scrap Worth</span>
              <div className={`text-xl font-extrabold mt-1.5 ${!result.canBeRefurbished ? "text-amber-500" : "text-muted-text"}`}>
                ₹{result.scrapValue.toLocaleString()}
              </div>
              <p className="text-[10px] text-muted-text mt-1">Direct copper/precious metals worth.</p>
            </div>
          </div>

          {/* DETAILED PRICE BREAKDOWN GRID */}
          <div className="border border-card-border bg-background rounded-xl p-4.5 space-y-3">
            <span className="text-[10px] font-bold text-muted-text uppercase tracking-wider block">Component Value Breakdown</span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 text-left text-xs font-semibold text-foreground">
              <div className="p-2.5 bg-card border border-card-border rounded-lg">
                <div className="text-muted-text text-[9px] font-bold uppercase">Motherboard</div>
                <div className="mt-1 text-xs">₹{result.breakdown.motherboard.toLocaleString()}</div>
              </div>
              <div className="p-2.5 bg-card border border-card-border rounded-lg">
                <div className="text-muted-text text-[9px] font-bold uppercase">Secondary PCBs</div>
                <div className="mt-1 text-xs">₹{result.breakdown.pcb.toLocaleString()}</div>
              </div>
              <div className="p-2.5 bg-card border border-card-border rounded-lg">
                <div className="text-muted-text text-[9px] font-bold uppercase">Battery cells</div>
                <div className="mt-1 text-xs">₹{result.breakdown.battery.toLocaleString()}</div>
              </div>
              <div className="p-2.5 bg-card border border-card-border rounded-lg">
                <div className="text-muted-text text-[9px] font-bold uppercase">Rare Metals</div>
                <div className="mt-1 text-xs">₹{result.breakdown.metals.toLocaleString()}</div>
              </div>
              <div className="p-2.5 bg-card border border-card-border rounded-lg">
                <div className="text-muted-text text-[9px] font-bold uppercase">Screen Glass</div>
                <div className="mt-1 text-xs">₹{result.breakdown.screen.toLocaleString()}</div>
              </div>
              <div className="p-2.5 bg-card border border-card-border rounded-lg">
                <div className="text-muted-text text-[9px] font-bold uppercase">RAM/Storage</div>
                <div className="mt-1 text-xs">₹{result.breakdown.storage.toLocaleString()}</div>
              </div>
            </div>
          </div>

          {/* AI Explanation & Sustainability */}
          {result.aiExplanation && (
            <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-4">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-500 uppercase tracking-wider mb-1">
                <Compass className="w-4 h-4 animate-spin-slow" />
                <span>AI Sustainability Report</span>
              </div>
              <p className="text-[11px] text-foreground leading-relaxed">
                {result.aiExplanation}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-3 border-t border-card-border">
            <button
              onClick={() => { setStep(1); setResult(null); setQuery(""); }}
              className="py-3 px-4 rounded-xl border border-card-border text-xs font-bold text-gray-500 hover:text-foreground transition-all cursor-pointer"
            >
              Re-Calculate
            </button>
            <button
              onClick={() => onSuccess(deviceName, result)}
              className="flex-1 py-3 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all shadow cursor-pointer text-center"
            >
              Lock Value & Schedule Doorstep Pickup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
