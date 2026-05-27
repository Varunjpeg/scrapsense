"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Mail, Lock, ArrowRight, ArrowLeft, RefreshCw, Leaf } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function LoginPage() {
  const router = useRouter();
  const { loginUser, loginRecycler } = useApp();

  const [role, setRole] = useState<"user" | "recycler">("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      if (role === "user") {
        await loginUser(email);
        router.push("/user/dashboard");
      } else {
        await loginRecycler(email);
        router.push("/recycler/dashboard");
      }
    } catch (err) {
      setError("Authentication failed. Please check credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      if (role === "user") {
        await loginUser("google.user@scrapsense.in");
        router.push("/user/dashboard");
      } else {
        await loginRecycler("google.recycler@scrapsense.in");
        router.push("/recycler/dashboard");
      }
    } catch (err) {
      setError("Google sign-in failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 relative overflow-hidden bg-background">
      {/* Glow Rings background */}
      <div className="absolute inset-0 eco-grid pointer-events-none opacity-30" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />

      {/* Floating back button to landing page */}
      <Link 
        href="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition-colors bg-white/5 border border-white/5 px-3.5 py-2 rounded-full backdrop-blur-sm"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return Home</span>
      </Link>

      <div className="w-full max-w-md relative z-10">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-lg shadow-emerald-500/5 mb-3.5">
            <Leaf className="w-7 h-7 animate-pulse" />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white">Welcome to ScrapSense</h2>
          <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-semibold font-mono">India's Smart E-Waste Ecosystem</p>
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
              User Portal
            </button>
            <button
              onClick={() => { setRole("recycler"); setError(""); }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                role === "recycler"
                  ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/10"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Recycler Portal
            </button>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold px-4 py-3 rounded-xl mb-4 text-center">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Email Address</label>
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

            {/* Password */}
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

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-all shadow-lg shadow-emerald-500/15 cursor-pointer text-xs"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Logging in...</span>
                </>
              ) : (
                <>
                  <span>Log In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </form>

          {/* Social login divider */}
          <div className="relative my-6 text-center select-none pointer-events-none">
            <hr className="border-white/5" />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-950 px-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
              Or sync account
            </span>
          </div>

          {/* Google SSO button */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-white/10 hover:border-white/20 text-xs font-bold text-white transition-colors bg-white/5 hover:bg-white/10 cursor-pointer"
          >
            <svg className="w-4 h-4 mr-1 shrink-0" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Footer Navigation */}
          <div className="text-center mt-6 text-[11px] text-gray-400">
            <span>New to ScrapSense? </span>
            <Link 
              href="/auth/signup"
              className="text-emerald-400 font-bold hover:underline"
            >
              Sign Up Now
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
