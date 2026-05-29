"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, ArrowRight, ShieldCheck, Mail, Lock, User, Phone, MapPin, 
  Award, RefreshCw, Leaf, Calendar, CheckCircle2 
} from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function SignupPage() {
  const router = useRouter();
  const { signupSendOtp, signupVerifyOtp, signupComplete } = useApp();

  const [signupStep, setSignupStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // OTP State Helper (so they can see the OTP directly in front of them on their screen during testing!)
  const [consoleOtp, setConsoleOtp] = useState("");

  // Form parameters
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  // Info details
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"customer" | "recycler" | "refurbisher">("customer");

  // Step 1: Send OTP to email
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Email address is required.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await signupSendOtp(email);
      if (res.success) {
        setSuccessMsg("Verification code dispatched to your inbox.");
        if (res.otp) {
          setConsoleOtp(res.otp); // Save so we can display a clean helper card!
        }
        setSignupStep(2);
      } else {
        setError(res.error || "Failed to dispatch verification code.");
      }
    } catch (err) {
      setError("Network offline. Unable to dispatch OTP.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) {
      setError("Please input the 6-digit verification code.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await signupVerifyOtp(email, otp);
      if (res.success) {
        setSuccessMsg("Email successfully verified.");
        setSignupStep(3);
      } else {
        setError(res.error || "Invalid or expired verification code.");
      }
    } catch (err) {
      setError("Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Complete Sign Up
  const handleCompleteSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !age || !phone || !address || !password) {
      setError("Please fill in all profile fields.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await signupComplete({
        name,
        age: parseInt(age),
        phone,
        address,
        email,
        password,
        role
      });

      if (res.success) {
        if (role === "customer") {
          router.push("/user/dashboard");
        } else {
          router.push("/recycler/dashboard");
        }
      } else {
        setError(res.error || "Signup failed.");
      }
    } catch (err) {
      setError("Failed to create profile. Verify connection is active.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden bg-background">
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
          <h2 className="text-2xl font-black tracking-tight text-foreground">Create Verified Account</h2>
          <p className="text-xs text-muted-text mt-1 uppercase tracking-wider font-semibold font-mono">Join India's Smart E-Waste Ecosystem</p>
        </div>

        {/* Dynamic Signup Box */}
        <div className="glassmorphism p-8 border border-card-border bg-card shadow-lg relative">
          
          {/* Progress Banner indicator */}
          <div className="flex justify-between items-center mb-6 border-b border-card-border pb-3 text-xs font-bold text-emerald-500 font-mono">
            <span>STEP {signupStep} OF 3</span>
            <div className="flex gap-1.5">
              {[1, 2, 3].map(s => (
                <div 
                  key={s} 
                  className={`w-4 h-1 rounded-full transition-all ${
                    s <= signupStep ? "bg-emerald-500" : "bg-card-border"
                  }`} 
                />
              ))}
            </div>
          </div>

          {error && (
            <div className="bg-red-500/5 border border-red-500/15 text-red-500 text-xs font-semibold px-4 py-3 rounded-xl mb-4 text-center">
              {error}
            </div>
          )}

          {successMsg && !error && (
            <div className="bg-emerald-500/5 border border-emerald-500/15 text-emerald-600 text-xs font-semibold px-4 py-3 rounded-xl mb-4 text-center">
              {successMsg}
            </div>
          )}

          {/* ==========================================
              STAGE 1: EMAIL ENTRY
              ========================================== */}
          {signupStep === 1 && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-text uppercase tracking-wider ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 w-4 h-4 text-muted-text" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-background border border-card-border rounded-xl pl-11 pr-4 py-3 text-xs text-foreground focus:outline-none focus:border-emerald-500/40"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl btn-green-gradient font-bold text-xs"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Send Verification Code</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* ==========================================
              STAGE 2: OTP VERIFICATION
              ========================================== */}
          {signupStep === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              
              {/* Local testing helper banner displaying current Mock OTP code */}
              {consoleOtp && (
                <div className="bg-amber-400/5 border border-amber-400/15 text-amber-600 text-[11px] font-medium p-3.5 rounded-xl text-left flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold">Verification Code Sent!</div>
                    <p className="mt-0.5">Use OTP code: <span className="font-mono font-bold bg-white px-1.5 py-0.5 rounded border border-amber-500/20 text-xs">{consoleOtp}</span></p>
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-text uppercase tracking-wider ml-1">Enter 6-Digit Code</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="e.g. 123456"
                  className="w-full bg-background border border-card-border rounded-xl px-4 py-3 text-center text-sm font-black tracking-widest text-foreground focus:outline-none focus:border-emerald-500/40"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl btn-green-gradient font-bold text-xs"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Verify Code</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <button 
                type="button" 
                onClick={() => setSignupStep(1)} 
                className="text-xs text-muted-text hover:text-foreground font-bold block text-center w-full"
              >
                Change Email Address
              </button>
            </form>
          )}

          {/* ==========================================
              STAGE 3: COLLECT PROFILE INFO
              ========================================== */}
          {signupStep === 3 && (
            <form onSubmit={handleCompleteSignup} className="space-y-3.5">
              
              {/* Role Switcher */}
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-muted-text uppercase tracking-wider ml-1">Account Role Type</label>
                <div className="flex bg-muted-border p-1 border border-card-border rounded-xl gap-1">
                  {(["customer", "recycler", "refurbisher"] as const).map(r => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${
                        role === r 
                          ? "bg-emerald-500 text-white shadow-sm" 
                          : "text-muted-text hover:text-foreground"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-muted-text uppercase tracking-wider ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 w-3.5 h-3.5 text-muted-text" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full bg-background border border-card-border rounded-xl pl-9 pr-3 py-2 text-xs text-foreground focus:outline-none focus:border-emerald-500/40"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-muted-text uppercase tracking-wider ml-1">Age</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 w-3.5 h-3.5 text-muted-text" />
                    <input
                      type="number"
                      required
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="28"
                      className="w-full bg-background border border-card-border rounded-xl pl-9 pr-3 py-2 text-xs text-foreground focus:outline-none focus:border-emerald-500/40"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-muted-text uppercase tracking-wider ml-1">Contact Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-2.5 w-3.5 h-3.5 text-muted-text" />
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 99999 88888"
                    className="w-full bg-background border border-card-border rounded-xl pl-10 pr-4 py-2 text-xs text-foreground focus:outline-none focus:border-emerald-500/40"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-muted-text uppercase tracking-wider ml-1">Primary Address</label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-2.5 w-3.5 h-3.5 text-muted-text" />
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Sector 63, Noida, Uttar Pradesh"
                    className="w-full bg-background border border-card-border rounded-xl pl-10 pr-4 py-2 text-xs text-foreground focus:outline-none focus:border-emerald-500/40"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-muted-text uppercase tracking-wider ml-1">Choose Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-2.5 w-3.5 h-3.5 text-muted-text" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-background border border-card-border rounded-xl pl-10 pr-4 py-2 text-xs text-foreground focus:outline-none focus:border-emerald-500/40"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl btn-green-gradient font-bold text-xs"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Complete Verification</span>
                    <CheckCircle2 className="w-4.5 h-4.5" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Footer Navigation */}
          <div className="text-center mt-6 text-[11px] text-muted-text">
            <span>Already have a verified account? </span>
            <Link 
              href="/auth/login"
              className="text-emerald-500 font-bold hover:underline"
            >
              Log In
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
