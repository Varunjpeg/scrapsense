"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ShieldCheck, Mail, Lock, User, Phone, MapPin, Award, RefreshCw, Leaf } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function SignupPage() {
  const router = useRouter();
  const { signupUser, signupRecycler } = useApp();

  const [role, setRole] = useState<"user" | "recycler">("user");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Common Fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // User Field
  const [name, setName] = useState("");

  // Recycler Business Fields
  const [businessName, setBusinessName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [services, setServices] = useState<string[]>([]);

  const handleServiceToggle = (service: string) => {
    setServices(prev =>
      prev.includes(service) ? prev.filter(s => s !== service) : [...prev, service]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in basic fields.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      if (role === "user") {
        if (!name) {
          setError("Name is required.");
          setLoading(false);
          return;
        }
        await signupUser(name, email);
        router.push("/user/dashboard");
      } else {
        if (!businessName || !ownerName || !phone || !address || !licenseNumber) {
          setError("All business details are required.");
          setLoading(false);
          return;
        }
        await signupRecycler(
          businessName,
          ownerName,
          email,
          phone,
          address,
          licenseNumber,
          services
        );
        router.push("/recycler/dashboard");
      }
    } catch (err) {
      setError("Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden bg-background">
      <div className="absolute inset-0 eco-grid pointer-events-none opacity-30" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />

      {/* Back button */}
      <Link 
        href="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition-colors bg-white/5 border border-white/5 px-3.5 py-2 rounded-full backdrop-blur-sm"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return Home</span>
      </Link>

      <div className="w-full max-w-xl relative z-10">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-lg shadow-emerald-500/5 mb-3.5">
            <Leaf className="w-7 h-7 animate-pulse" />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white">Create Your Account</h2>
          <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-semibold font-mono">Join India's Smart E-Waste Ecosystem</p>
        </div>

        {/* Glass Box Container */}
        <div className="glassmorphism rounded-3xl p-8 border border-white/5 shadow-2xl relative">
          
          {/* Portal Switcher */}
          <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-white/5 mb-6">
            <button
              onClick={() => { setRole("user"); setError(""); }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                role === "user"
                  ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/10"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              User Account
            </button>
            <button
              onClick={() => { setRole("recycler"); setError(""); }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                role === "recycler"
                  ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/10"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Business Registration
            </button>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold px-4 py-3 rounded-xl mb-4 text-center">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {role === "user" ? (
              // USER SIGNUP FIELDS
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-3.5 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full bg-slate-950 border border-white/5 rounded-xl pl-11 pr-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500/40 placeholder-gray-600"
                    />
                  </div>
                </div>
              </div>
            ) : (
              // RECYCLER / BUSINESS REGISTRATION FIELDS
              <div className="space-y-4 animate-in fade-in duration-200 grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div className="space-y-1 col-span-1 md:col-span-2">
                  <h4 className="text-xs font-extrabold text-emerald-400 uppercase tracking-widest mb-1">Company Specifications</h4>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Shop/Business Name</label>
                  <div className="relative">
                    <Award className="absolute left-4 top-3.5 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="e.g. GreenTech Recyclers"
                      className="w-full bg-slate-950 border border-white/5 rounded-xl pl-11 pr-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500/40 placeholder-gray-600"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Owner Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-3.5 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      placeholder="Amit Kumar"
                      className="w-full bg-slate-950 border border-white/5 rounded-xl pl-11 pr-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500/40 placeholder-gray-600"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Contact Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-3.5 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 99999 88888"
                      className="w-full bg-slate-950 border border-white/5 rounded-xl pl-11 pr-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500/40 placeholder-gray-600"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">E-Waste Board License ID</label>
                  <div className="relative">
                    <ShieldCheck className="absolute left-4 top-3.5 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      value={licenseNumber}
                      onChange={(e) => setLicenseNumber(e.target.value)}
                      placeholder="DL-EW-2026-0498"
                      className="w-full bg-slate-950 border border-white/5 rounded-xl pl-11 pr-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500/40 placeholder-gray-600"
                    />
                  </div>
                </div>

                <div className="space-y-1 col-span-1 md:col-span-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Shop Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-3.5 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Shop 12, Kirti Nagar Market, New Delhi"
                      className="w-full bg-slate-950 border border-white/5 rounded-xl pl-11 pr-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500/40 placeholder-gray-600"
                    />
                  </div>
                </div>

                <div className="space-y-1 col-span-1 md:col-span-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Specialties & Operations</label>
                  <div className="flex flex-wrap gap-2 mt-1.5">
                    {["Urban Mining", "PCB Shredding", "Lead Extraction", "Appliance Disassembly", "Display Delamination", "Battery Safekeeping"].map(serv => {
                      const isChecked = services.includes(serv);
                      return (
                        <button
                          key={serv}
                          type="button"
                          onClick={() => handleServiceToggle(serv)}
                          className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold transition-all ${
                            isChecked
                              ? "bg-emerald-500/15 border-emerald-500 text-emerald-400"
                              : "bg-slate-950 border-white/5 text-gray-400 hover:text-white"
                          }`}
                        >
                          {serv}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-1 col-span-1 md:col-span-2 border-t border-white/5 pt-4">
                  <h4 className="text-xs font-extrabold text-emerald-400 uppercase tracking-widest mb-1 font-mono">Authentication credentials</h4>
                </div>
              </div>
            )}

            {/* Common Auth Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 w-4 h-4 text-gray-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-slate-950 border border-white/5 rounded-xl pl-11 pr-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500/40 placeholder-gray-600"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 w-4 h-4 text-gray-500" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950 border border-white/5 rounded-xl pl-11 pr-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500/40 placeholder-gray-600"
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-all shadow-lg shadow-emerald-500/15 cursor-pointer text-xs"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Registering...</span>
                </>
              ) : (
                <>
                  <span>Create Account & Verify</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </form>

          {/* Divider */}
          <div className="text-center mt-6 text-[11px] text-gray-400">
            <span>Already have an account? </span>
            <Link 
              href="/auth/login"
              className="text-emerald-400 font-bold hover:underline"
            >
              Log In
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
