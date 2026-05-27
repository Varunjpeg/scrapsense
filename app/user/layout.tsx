"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, MapPin, Wrench, BadgeDollarSign, User, LogOut, Sun, Moon, Leaf, Coins, MessageSquareCode
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { useTheme } from "@/context/ThemeContext";
import ChatSupport from "@/components/ChatSupport";

const menuItems = [
  { label: "Dashboard", href: "/user/dashboard", icon: LayoutDashboard },
  { label: "Search Dealers", href: "/user/dealers", icon: MapPin },
  { label: "Search Refurbishers", href: "/user/refurbishers", icon: Wrench },
  { label: "AI Valuation", href: "/user/valuation", icon: BadgeDollarSign },
  { label: "Your Profile", href: "/user/profile", icon: User },
];

export default function UserPortalLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, role, logout } = useApp();
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Secure client-side redirect if not authenticated
  useEffect(() => {
    if (mounted && (!user || role !== "user")) {
      router.push("/auth/login");
    }
  }, [user, role, mounted, router]);

  if (!mounted || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-3">
          <Leaf className="w-8 h-8 text-emerald-400 animate-spin" />
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest font-mono">Authenticating Portal...</span>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background text-foreground">
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-full md:w-64 border-r border-white/5 bg-slate-950/20 backdrop-blur-md flex flex-col justify-between shrink-0 p-4">
        <div className="space-y-8">
          
          {/* Logo brand */}
          <div className="flex items-center gap-2 px-2 mt-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Leaf className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <span className="text-sm font-black tracking-tight text-white">Scrap<span className="text-emerald-400">Sense</span></span>
              <span className="text-[8px] bg-emerald-500/10 text-emerald-400 font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider ml-1 border border-emerald-500/20">
                User
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {menuItems.map(item => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/10"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-4.5 h-4.5 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="space-y-4 pt-4 border-t border-white/5">
          {/* Theme switcher */}
          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl border border-white/5 hover:border-white/10 text-xs font-bold text-gray-400 hover:text-white transition-all bg-white/5"
          >
            <div className="flex items-center gap-2.5">
              {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-emerald-400" />}
              <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
            </div>
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-4.5 h-4.5" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* PRIMARY VIEWER PORT */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Header Panel */}
        <header className="border-b border-white/5 bg-slate-950/20 backdrop-blur-md px-6 py-4 flex items-center justify-between">
          <div className="text-sm font-black text-white leading-tight">
            User Workspace
          </div>
          
          <div className="flex items-center gap-4">
            
            {/* Wallet pill */}
            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 rounded-full shadow-inner select-none">
              <Coins className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-extrabold text-emerald-400">
                ₹{user.walletBalance.toLocaleString()}
              </span>
            </div>

            {/* Reward Points Badge */}
            <div className="flex items-center gap-1.5 bg-amber-400/10 border border-amber-400/20 px-3 py-1.5 rounded-full shadow-inner select-none">
              <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">
                {user.rewardPoints} PTS
              </span>
            </div>

            {/* Profile Avatar */}
            <Link href="/user/profile" className="flex items-center gap-2 border-l border-white/10 pl-4 group">
              <img
                src={user.avatar}
                alt="Profile"
                className="w-8 h-8 rounded-full border border-white/10 group-hover:border-emerald-400 transition-colors"
              />
              <span className="hidden sm:inline text-xs font-bold text-gray-300 group-hover:text-white transition-colors">
                {user.name}
              </span>
            </Link>
          </div>
        </header>

        {/* Dashboard Pages wrapper */}
        <main className="flex-1 p-6 overflow-y-auto relative z-10">
          {children}
        </main>
      </div>

      {/* Persistent Floating Chat Overlay */}
      <ChatSupport />
    </div>
  );
}
