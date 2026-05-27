"use client";

import React, { useState } from "react";
import { UploadCloud, Camera, Eye, Cpu, Compass, RefreshCw, AlertCircle, Sparkles } from "lucide-react";
import { DeviceValuation } from "@/context/AppContext";

interface DeviceCameraUploadProps {
  onSuccess: (deviceName: string, baseValuation: any) => void;
}

export default function DeviceCameraUpload({ onSuccess }: DeviceCameraUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanStep, setScanStep] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [detectedData, setDetectedData] = useState<any>(null);

  const startCameraScan = () => {
    setScanning(true);
    setPhotoPreview(null);
    setDetectedData(null);

    // Phase 1: Initiate scanner viewfinder
    setScanStep("Calibrating Lens & Eco-Grid...");
    
    // Phase 2: Simulating frame capture
    setTimeout(() => {
      setScanStep("Capturing hardware diagnostics...");
      setPhotoPreview("https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=350&auto=format&fit=crop");
    }, 1200);

    // Phase 3: Run AI classification POST API call
    setTimeout(async () => {
      setScanStep("AI image analysis & thermal matching...");
      try {
        const response = await fetch("/api/ai/analyze-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: "mocked_capture" })
        });
        const data = await response.json();
        if (data.success) {
          setDetectedData(data);
          setScanStep("Classification Complete!");
        }
      } catch (error) {
        console.error("Camera scan failed:", error);
      }
    }, 2800);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      // Simulate file upload and trigger same high-end scanner
      startCameraScan();
    }
  };

  const triggerFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      startCameraScan();
    }
  };

  const handleProceed = () => {
    if (!detectedData) return;

    // Build base valuation state based on detected model to bypass wizard stage 1!
    const baseValuation: DeviceValuation = {
      deviceName: detectedData.detectedModel,
      category: detectedData.category,
      age: "1-2 Years",
      isFunctional: true,
      physicalCondition: "Good",
      batteryCondition: "Good (Above 80%)",
      screenCondition: "Good (Minor Scratches)",
      accessories: ["Original Box"],
      resaleValue: detectedData.category === "Laptop" ? 22000 : 12500,
      scrapValue: detectedData.category === "Laptop" ? 1800 : 650,
      refurbishPossibility: 78,
      canBeRefurbished: true,
      miningYield: detectedData.miningYield
    };

    onSuccess(detectedData.detectedModel, baseValuation);
  };

  return (
    <div className="w-full max-w-xl mx-auto glassmorphism rounded-3xl p-8 border border-white/5 shadow-2xl relative overflow-hidden">
      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 eco-grid pointer-events-none opacity-25" />

      {/* Main Drag-Drop or Scan Panel */}
      {!scanning && !detectedData && (
        <div 
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`relative z-10 border-2 border-dashed rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[300px] transition-all duration-300 ${
            dragActive 
              ? "border-emerald-400 bg-emerald-500/5 scale-102" 
              : "border-white/10 hover:border-emerald-500/20 bg-slate-950/20 hover:bg-slate-950/40"
          }`}
        >
          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept="image/*"
            onChange={triggerFileUpload}
          />
          
          <div className="p-4 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-4 animate-pulse">
            <UploadCloud className="w-8 h-8" />
          </div>

          <h3 className="text-lg font-bold text-white leading-tight">Drag and drop device photo</h3>
          <p className="text-xs text-gray-400 mt-1 max-w-[280px]">
            Or upload from your device to auto-detect hardware specifications.
          </p>

          <div className="flex gap-3 mt-6">
            <label
              htmlFor="file-upload"
              className="px-4 py-2.5 rounded-xl border border-white/15 hover:border-emerald-500/30 text-xs font-bold text-white transition-all bg-white/5 hover:bg-emerald-500/10 cursor-pointer"
            >
              Choose Photo
            </label>
            <button
              onClick={startCameraScan}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-lg shadow-emerald-500/15 cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Use Camera</span>
            </button>
          </div>
        </div>
      )}

      {/* SCANNING ACTIVE SCREEN */}
      {scanning && !detectedData && (
        <div className="relative z-10 text-center py-8 min-h-[300px] flex flex-col items-center justify-between">
          <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5 animate-pulse">
            <Cpu className="w-3.5 h-3.5 animate-spin-slow" />
            <span>AI vision engine executing</span>
          </div>

          {/* Scanner Viewfinder Simulation */}
          <div className="w-[180px] h-[180px] border-2 border-emerald-500/40 rounded-3xl relative overflow-hidden my-6 bg-slate-950 flex items-center justify-center shadow-2xl">
            {photoPreview ? (
              <img 
                src={photoPreview} 
                alt="Scan preview" 
                className="w-full h-full object-cover animate-in fade-in duration-300"
              />
            ) : (
              <Camera className="w-10 h-10 text-emerald-500/30 animate-pulse" />
            )}
            
            {/* Glowing scan horizontal line */}
            <div className="absolute left-0 right-0 h-0.5 bg-emerald-400 shadow-md shadow-emerald-500/60 animate-[bounce_2.5s_infinite]" />
            {/* Fine radar mesh */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(16,185,129,0.15))] pointer-events-none" />
          </div>

          <div className="space-y-1.5">
            <div className="text-sm font-bold text-white">{scanStep}</div>
            <div className="text-[10px] text-gray-500 font-mono">
              Analyzing RGB matrix arrays & bezel metrics...
            </div>
          </div>
        </div>
      )}

      {/* DETECTED HARDWARE RESULT PANEL */}
      {detectedData && (
        <div className="relative z-10 space-y-6 animate-in fade-in zoom-in-95 duration-300">
          <div className="text-center">
            <div className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>AI Auto-Detection Complete</span>
            </div>
            
            <h3 className="text-2xl font-black text-white mt-3">
              {detectedData.detectedModel}
            </h3>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono mt-0.5">
              Category: {detectedData.category} ({(detectedData.confidence * 100).toFixed(0)}% Confidence)
            </p>
          </div>

          {/* Urban Mining Alert */}
          <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/10 flex items-start gap-3">
            <Compass className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5 animate-spin-slow" />
            <p className="text-xs text-cyan-200/90 leading-relaxed font-medium">
              {detectedData.urbanMiningInsights.text}
            </p>
          </div>

          {/* Yield Predictions preview */}
          <div className="border border-white/5 bg-slate-950/40 rounded-2xl p-4">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2.5">
              Predicted Recyclable Gold & Copper Yields
            </div>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-slate-950 border border-white/5 p-3 rounded-xl">
                <div className="text-base font-extrabold text-amber-400">
                  {detectedData.miningYield.gold}g
                </div>
                <div className="text-[9px] text-gray-500 font-bold uppercase mt-0.5">Gold Metal Yield</div>
              </div>
              <div className="bg-slate-950 border border-white/5 p-3 rounded-xl">
                <div className="text-base font-extrabold text-orange-400">
                  {detectedData.miningYield.copper}g
                </div>
                <div className="text-[9px] text-gray-500 font-bold uppercase mt-0.5">Copper Metal Yield</div>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setDetectedData(null)}
              className="py-3 px-4 rounded-xl border border-white/5 hover:border-white/10 text-xs text-gray-400 hover:text-white font-bold transition-all cursor-pointer"
            >
              Scan New
            </button>
            <button
              onClick={handleProceed}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-all shadow-lg shadow-emerald-500/25 cursor-pointer text-xs"
            >
              <span>Validate Diagnosis</span>
              <Camera className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
