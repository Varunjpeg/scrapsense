"use client";

import React, { useState, useRef, useEffect } from "react";
import { UploadCloud, Camera, RefreshCw, AlertCircle, CheckCircle, X, ArrowRight } from "lucide-react";

interface DeviceCameraUploadProps {
  onSuccess: (deviceName: string, baseValuation: any) => void;
}

export default function DeviceCameraUpload({ onSuccess }: DeviceCameraUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [errorText, setErrorText] = useState("");

  // Camera states
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);

  // Vision Result State
  const [detectedResult, setDetectedResult] = useState<any>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Stop camera stream on unmount
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraStream]);

  // Request HTML5 camera stream access
  const enableCamera = async () => {
    setErrorText("");
    setCapturedPhoto(null);
    setDetectedResult(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false
      });
      setCameraStream(stream);
      setCameraActive(true);
      
      // Assign to video element
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);

    } catch (err: any) {
      console.error("Camera access failed:", err);
      setErrorText("Camera permission denied or device not found. Please drag and drop a manual image upload instead.");
      setCameraActive(false);
    }
  };

  const disableCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setCameraActive(false);
  };

  // Capture frame to canvas
  const captureFrame = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        // Set canvas boundaries to video aspect ratios
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert to Base64
        const photoData = canvas.toDataURL("image/jpeg");
        setCapturedPhoto(photoData);
        disableCamera();
      }
    }
  };

  // Trigger Gemini API Vision processing on backend
  const processImage = async (base64Image: string) => {
    setLoading(true);
    setErrorText("");
    setStatusText("Initializing Gemini Vision API...");

    try {
      // Simulate real-world step tracking for visual feedback
      setTimeout(() => setStatusText("Classifying chassis and motherboard metrics..."), 800);
      setTimeout(() => setStatusText("Calculating rare-earth metal weights..."), 1500);

      const response = await fetch("/api/ai/analyze-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64Image })
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        setDetectedResult(data);
      } else {
        throw new Error(data.error || "Vision analysis failed.");
      }

    } catch (err: any) {
      console.error("Vision processing error:", err);
      setErrorText(err.message || "Network offline. Unable to parse device image.");
    } finally {
      setLoading(false);
    }
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
      const file = e.dataTransfer.files[0];
      readFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      readFile(e.target.files[0]);
    }
  };

  const readFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setErrorText("Invalid file type. Please upload a valid image (JPEG/PNG).");
      return;
    }
    setErrorText("");
    setDetectedResult(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const base64 = event.target.result as string;
        setCapturedPhoto(base64);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleProceed = () => {
    if (!detectedResult) return;

    // Direct mock response that maps category variables to rule-based price calculations
    // To trigger valuation/route.ts dynamically, we fetch `/api/ai/valuation` using detected data parameters!
    // This perfectly coordinates the hybrid system (AI Vision detects -> Rule-based API routes calculate).
    setLoading(true);
    setStatusText("Syncing parameters with rule-based calculator...");

    setTimeout(async () => {
      try {
        const response = await fetch("/api/ai/valuation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            deviceName: detectedResult.detectedModel,
            age: "1-2 Years", // default age for vision scan
            isFunctional: true,
            physicalCondition: detectedResult.physicalCondition,
            batteryCondition: "Good",
            screenCondition: "Good",
            accessories: ["Original Box"]
          })
        });

        const valData = await response.json();
        if (valData.success) {
          onSuccess(detectedResult.detectedModel, valData.valuation);
        } else {
          throw new Error("Calculator sync failed.");
        }
      } catch (err: any) {
        setErrorText("Failed to calculate price splits. Please try again.");
      } finally {
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="w-full max-w-xl mx-auto glassmorphism rounded-2xl p-6 border border-card-border bg-card shadow relative overflow-hidden text-left">
      <div className="absolute inset-0 eco-grid pointer-events-none opacity-20" />

      {errorText && (
        <div className="bg-red-500/5 border border-red-500/10 text-red-400 text-xs font-semibold px-4 py-3 rounded-xl mb-4 flex items-start gap-2 animate-in fade-in duration-200">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{errorText}</span>
        </div>
      )}

      {/* VIEWPORT STREAM SCREEN */}
      {cameraActive && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-950 border border-card-border flex items-center justify-center">
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
            <div className="absolute inset-0 border border-emerald-500/10 pointer-events-none" />
          </div>
          <div className="flex gap-3">
            <button
              onClick={disableCamera}
              className="py-2.5 px-4 rounded-xl border border-card-border text-xs text-gray-500 hover:text-foreground font-bold"
            >
              Cancel camera
            </button>
            <button
              onClick={captureFrame}
              className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Camera className="w-4.5 h-4.5" />
              <span>Capture Photo Preview</span>
            </button>
          </div>
        </div>
      )}

      {/* VIEW CAPTURED PHOTO & TRIGGER PROCESSING */}
      {!cameraActive && capturedPhoto && !detectedResult && !loading && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="text-xs font-bold text-emerald-500 uppercase tracking-widest font-mono">Captured Photo Preview</div>
          <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-950 border border-card-border flex items-center justify-center">
            <img src={capturedPhoto} alt="Capture preview" className="w-full h-full object-cover" />
            <button
              onClick={() => setCapturedPhoto(null)}
              className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-950/80 border border-white/5 text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setCapturedPhoto(null)}
              className="py-2.5 px-4 rounded-xl border border-card-border text-xs text-gray-500 hover:text-foreground font-bold"
            >
              Retake Photo
            </button>
            <button
              onClick={() => processImage(capturedPhoto)}
              className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Analyze Image with Gemini</span>
            </button>
          </div>
        </div>
      )}

      {/* LOADING STATE */}
      {loading && (
        <div className="py-12 text-center space-y-4 animate-in fade-in duration-200">
          <RefreshCw className="w-8 h-8 text-emerald-500 animate-spin mx-auto" />
          <div className="text-sm font-bold text-foreground">{statusText}</div>
          <p className="text-[10px] text-muted-text max-w-xs mx-auto">
            Queries the Google Gemini-1.5-Flash model directly to understand hardware components.
          </p>
        </div>
      )}

      {/* VISION RESULT DETECTED SCREEN */}
      {detectedResult && !loading && (
        <div className="space-y-5 animate-in fade-in zoom-in-95 duration-200">
          <div className="text-center pb-4 border-b border-card-border">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-extrabold uppercase font-mono tracking-wider">
              <span>✓ AI Vision Match</span>
            </div>
            <h3 className="text-lg font-black text-foreground mt-3">{detectedResult.detectedModel}</h3>
            <p className="text-[10px] text-muted-text font-bold uppercase tracking-wider mt-1 font-mono">
              Category: {detectedResult.category} • Condition: {detectedResult.physicalCondition}
            </p>
          </div>

          {/* Sustainability reports */}
          <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-xs">
            <div className="font-bold text-emerald-500 uppercase tracking-wider mb-1 flex items-center gap-1 font-mono">
              <span>★ Environmental Statement</span>
            </div>
            <p className="text-foreground leading-relaxed">{detectedResult.urbanMiningInsights.text}</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => { setDetectedResult(null); setCapturedPhoto(null); }}
              className="py-2.5 px-4 rounded-xl border border-card-border text-xs text-gray-500 hover:text-foreground font-bold"
            >
              Scan new
            </button>
            <button
              onClick={handleProceed}
              className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow"
            >
              <span>Validate Diagnosis Payouts</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* INITIAL EMPTY STATE */}
      {!cameraActive && !capturedPhoto && !detectedResult && !loading && (
        <div 
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-8 text-center flex flex-col items-center justify-center min-h-[260px] transition-all duration-200 ${
            dragActive 
              ? "border-emerald-500 bg-emerald-500/5" 
              : "border-card-border hover:border-emerald-500/30 bg-background"
          }`}
        >
          <input
            type="file"
            id="file-select"
            className="hidden"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleFileChange}
          />
          
          <div className="p-3.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 mb-4 animate-pulse">
            <UploadCloud className="w-7 h-7" />
          </div>

          <h3 className="text-sm font-bold text-foreground">Drag and drop device photograph</h3>
          <p className="text-[11px] text-muted-text mt-1 max-w-xs mx-auto leading-normal">
            Manually upload a photograph or trigger your active camera viewfinder to diagnose with Google Gemini.
          </p>

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2.5 rounded-xl border border-card-border hover:border-emerald-500/30 text-xs font-bold text-foreground transition-all bg-card hover:bg-emerald-500/5 cursor-pointer"
            >
              Upload Photo
            </button>
            <button
              onClick={enableCamera}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>Use Camera</span>
            </button>
          </div>
        </div>
      )}

      {/* Hidden canvas for drawing frames */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
