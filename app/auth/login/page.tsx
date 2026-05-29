"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Mail, Lock, ArrowRight, ArrowLeft, RefreshCw, Leaf } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function LoginPage() {
  const router = useRouter();
  const { loginUser } = useApp();

  const [role, setRole] = useState<"customer" | "recycler">("customer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in both fields.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await loginUser(email, password);
      
      if (res.success) {
        if (role === "customer") {
          router.push("/user/dashboard");
        } else {
          router.push("/recycler/dashboard");
        }
      } else {
        setError(res.error || "Invalid credentials. Please try again.");
      }
    } catch (err) {
      setError("Server error. Please verify database is active.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 relative overflow-hidden bg-background">
      <div className="absolute inset-0 eco-grid pointer-events-none opacity-40" />

      {/* Floating Back Button */}
      <Link 
        href="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-xs font-bold text-muted-text hover:text-foreground transition-colors bg-white border border-card-border px-4 py-2 rounded-full shadow-sm"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return Home</span>
      </Link>

      <div className="w-full max-w-md relative z-10">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-sm mb-3.5">
            <Leaf className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-foreground">Sign In to ScrapSense</h2>
          <p className="text-xs text-muted-text mt-1 uppercase tracking-wider font-semibold font-mono">India's Smart E-Waste Ecosystem</p>
        </div>

        {/* Crisp White Glass Box */}
        <div className="glassmorphism p-8 border border-card-border bg-card shadow-lg relative">
          
          {/* Portal Switcher */}
          <div className="flex bg-muted-border p-1 rounded-xl border border-card-border mb-6">
            <button
              onClick={() => { setRole("customer"); setError(""); }}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                role === "customer"
                  ? "bg-emerald-500 text-white shadow-sm"
                  : "text-muted-text hover:text-foreground"
              }`}
            >
              User Portal
            </button>
            <button
              onClick={() => { setRole("recycler"); setError(""); }}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                role === "recycler"
                  ? "bg-emerald-500 text-white shadow-sm"
                  : "text-muted-text hover:text-foreground"
              }`}
            >
              Partner Recycler
            </button>
          </div>

          {error && (
            <div className="bg-red-500/5 border border-red-500/15 text-red-500 text-xs font-semibold px-4 py-3 rounded-xl mb-4 text-center">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-text uppercase tracking-wider ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 w-4 h-4 text-muted-text" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-background border border-card-border rounded-xl pl-11 pr-4 py-3.5 text-xs text-foreground focus:outline-none focus:border-emerald-500/40 placeholder-slate-400"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-text uppercase tracking-wider ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-4 h-4 text-muted-text" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-background border border-card-border rounded-xl pl-11 pr-4 py-3.5 text-xs text-foreground focus:outline-none focus:border-emerald-500/40 placeholder-slate-400"
                />
              </div>
            </div>

            {/* Login button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl btn-green-gradient font-bold transition-all cursor-pointer text-xs"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </form>

          {/* Footer Navigation */}
          <div className="text-center mt-6 text-[11px] text-muted-text">
            <span>New to ScrapSense? </span>
            <Link 
              href="/auth/signup"
              className="text-emerald-500 font-bold hover:underline"
            >
              Create Verified Account
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
