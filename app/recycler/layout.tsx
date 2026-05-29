"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, Archive, Inbox, User, LogOut, Leaf, Star, Award
} from "lucide-react";
import { useApp } from "@/context/AppContext";

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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Secure client-side redirect if not authenticated as recycler/refurbisher
  useEffect(() => {
    if (mounted && (!recycler || (role !== "recycler" && role !== "refurbisher"))) {
      router.push("/auth/login");
    }
  }, [recycler, role, mounted, router]);

  if (!mounted || !recycler) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-3">
          <Leaf className="w-8 h-8 text-emerald-500 animate-spin" />
          <span className="text-xs font-semibold text-muted-text uppercase tracking-widest font-mono">Loading Partner Workspace...</span>
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
      <aside className="w-full md:w-64 border-r border-card-border bg-card flex flex-col justify-between shrink-0 p-4 shadow-sm">
        <div className="space-y-8">
          
          {/* Logo brand */}
          <div className="flex items-center gap-2.5 px-2 mt-2 select-none">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
              <Leaf className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-extrabold tracking-tight text-foreground">Scrap<span className="text-emerald-500">Sense</span></span>
              <span className="text-[8px] bg-emerald-500/10 text-emerald-600 font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider ml-1.5 border border-emerald-500/20 font-mono">
                {role === "refurbisher" ? "REFURB" : "RECYCLER"}
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
                      ? "bg-emerald-500 text-white shadow-sm"
                      : "text-muted-text hover:text-foreground hover:bg-muted-border"
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
        <div className="space-y-4 pt-4 border-t border-card-border">
          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-red-500 hover:text-red-600 hover:bg-red-500/5 transition-all cursor-pointer"
          >
            <LogOut className="w-4.5 h-4.5" />
            <span>Exit Workspace</span>
          </button>
        </div>
      </aside>

      {/* PRIMARY VIEWER PORT */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Header Panel */}
        <header className="border-b border-card-border bg-card px-6 py-4 flex items-center justify-between shadow-sm">
          <div className="text-xs font-black text-foreground uppercase tracking-wider font-mono">
            Partner Workspace ({role})
          </div>
          
          <div className="flex items-center gap-3.5">
            
            {/* Business rating stars */}
            <div className="flex items-center gap-1.5 bg-amber-400/10 border border-amber-400/20 px-3 py-1.5 rounded-full select-none">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-current" />
              <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest font-mono">
                ★ {recycler.ratings} Rating
              </span>
            </div>

            {/* Recycler Points */}
            <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 rounded-full select-none">
              <Award className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-extrabold text-emerald-600">
                {recycler.points} Points
              </span>
            </div>

            {/* Profile Avatar / Identity */}
            <div className="flex items-center gap-2 border-l border-card-border pl-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-black text-sm select-none shadow-sm">
                {recycler.businessName[0]}
              </div>
              <span className="hidden sm:inline text-xs font-bold text-muted-text">
                {recycler.businessName}
              </span>
            </div>
          </div>
        </header>

        {/* Dashboard Pages wrapper */}
        <main className="flex-1 p-6 overflow-y-auto relative z-10 bg-background animate-in fade-in duration-200">
          {children}
        </main>
      </div>
    </div>
  );
}
