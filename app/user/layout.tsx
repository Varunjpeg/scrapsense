"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

import {
  LayoutDashboard,
  MapPin,
  Wrench,
  BadgeDollarSign,
  User,
  LogOut,
  Leaf,
  Coins,
  Award,
} from "lucide-react";

import { useApp } from "@/context/AppContext";
import ChatSupport from "@/components/ChatSupport";

const menuItems = [
  {
    label: "Dashboard",
    href: "/user/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Search Dealers",
    href: "/user/dealers",
    icon: MapPin,
  },
  {
    label: "Search Refurbishers",
    href: "/user/refurbishers",
    icon: Wrench,
  },
  {
    label: "AI Valuation",
    href: "/user/valuation",
    icon: BadgeDollarSign,
  },
  {
    label: "Your Profile",
    href: "/user/profile",
    icon: User,
  },
];

export default function UserPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const { user, role, logout } = useApp();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && (!user || role !== "customer")) {
      router.push("/auth/login");
    }
  }, [user, role, mounted, router]);

  if (!mounted || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Leaf className="w-8 h-8 text-emerald-500 animate-spin" />
          <span className="text-xs font-semibold text-muted-text uppercase tracking-widest">
            Authenticating Session...
          </span>
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
      {/* Sidebar */}
      <aside className="w-full md:w-64 border-r border-card-border bg-card flex flex-col justify-between shrink-0 p-4 shadow-sm">
        <div className="space-y-8">
          <div className="flex items-center gap-2.5 px-2 mt-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
              <Leaf className="w-4 h-4" />
            </div>

            <div>
              <span className="text-lg font-black tracking-tight">
                Scrap<span className="text-emerald-600">Sense</span>
              </span>

              <div className="mt-1">
                <span className="text-[10px] bg-emerald-500/10 text-emerald-700 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  User Portal
                </span>
              </div>
            </div>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${isActive
                      ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg"
                      : "text-muted-text hover:bg-emerald-500/5 hover:text-emerald-600"
                    }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-4 border-t border-card-border">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-red-500 hover:text-red-600 hover:bg-red-500/5 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Exit Workspace</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="border-b border-card-border bg-card px-6 py-4 flex items-center justify-between shadow-sm">
          <div>
            <div className="text-xs font-black uppercase tracking-wider">
              User Workspace
            </div>

            <p className="text-[10px] text-muted-text mt-0.5">
              India’s smartest AI-powered e-waste ecosystem
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full">
              <Coins className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold text-emerald-600">
                ₹{user.walletBalance?.toLocaleString() || 0}
              </span>
            </div>

            <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full">
              <Award className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-[10px] font-black text-emerald-600">
                {user.rewardPoints || 0} PTS
              </span>
            </div>

            <Link
              href="/user/profile"
              className="flex items-center gap-2 border-l border-card-border pl-4 group"
            >
              <img
                src={user.avatar || "/default-avatar.png"}
                alt="Profile"
                className="w-8 h-8 rounded-full border border-card-border object-cover group-hover:border-emerald-500 transition-all"
              />

              <span className="hidden sm:inline text-xs font-bold group-hover:text-emerald-600 transition-all">
                {user.name}
              </span>
            </Link>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>

      <ChatSupport />
    </div>
  );
}