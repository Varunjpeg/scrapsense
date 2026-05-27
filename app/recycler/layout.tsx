"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, Archive, Inbox, User, LogOut, Sun, Moon, Leaf, Coins, Star, Award
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { useTheme } from "@/context/ThemeContext";

const menuItems = [
  { label: "Business Analytics", href: "/recycler/dashboard", icon: LayoutDashboard },
  { label: "Orders Waiting", href: "/recycler/orders", icon: Inbox },
  { label: "Collected Inventory", href: "/recycler/collected", icon: Archive },
  { label: "Business Profile", href: "/recycler/profile", icon: User },
];

export default function RecyclerPortalLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { recycler, role, logout } = useApp();
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Secure client-side redirect if not authenticated as recycler
  useEffect(() => {
    if (mounted && (!recycler || role !== "recycler")) {
      router.push("/auth/login");
    }
  }, [recycler, role, mounted, router]);

  if (!mounted || !recycler) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-3">
          <Leaf className="w-8 h-8 text-emerald-400 animate-spin" />
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest font-mono">Loading Business Portal...</span>
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
                Partner
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
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl border border-white/5 hover:border-white/10 text-xs font-bold text-gray-400 hover:text-white transition-all bg-white/5 bg-opacity-20"
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
            <span>Exit Workspace</span>
          </button>
        </div>
      </aside>

      {/* PRIMARY VIEWER PORT */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Header Panel */}
        <header className="border-b border-white/5 bg-slate-950/20 backdrop-blur-md px-6 py-4 flex items-center justify-between">
          <div className="text-sm font-black text-white leading-tight">
            Partner Recycler Workspace
          </div>
          
          <div className="flex items-center gap-4">
            
            {/* Business rating stars */}
            <div className="flex items-center gap-1.5 bg-amber-400/10 border border-amber-400/20 px-3 py-1.5 rounded-full select-none">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-current" />
              <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">
                ★ {recycler.ratings} Rating
              </span>
            </div>

            {/* Recycler Points */}
            <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 rounded-full select-none">
              <Award className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-extrabold text-emerald-400">
                {recycler.points} Points
              </span>
            </div>

            {/* Profile Avatar / Identity */}
            <div className="flex items-center gap-2 border-l border-white/10 pl-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-slate-950 font-black text-sm select-none">
                {recycler.businessName[0]}
              </div>
              <span className="hidden sm:inline text-xs font-bold text-gray-300">
                {recycler.businessName}
              </span>
            </div>
          </div>
        </header>

        {/* Dashboard Pages wrapper */}
        <main className="flex-1 p-6 overflow-y-auto relative z-10">
          {children}
        </main>
      </div>
    </div>
  );
}
