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

  // Redirect if not authenticated
  useEffect(() => {
    if (mounted && (!user || role !== "user")) {
      router.push("/auth/login");
    }
  }, [user, role, mounted, router]);

  if (!mounted || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <Leaf className="w-8 h-8 text-green-500 animate-spin" />
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
            Authenticating Portal...
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
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-green-50 via-white to-emerald-50 text-gray-900">
      
      {/* SIDEBAR */}
      <aside className="w-full md:w-64 border-r border-green-100 bg-white shadow-sm flex flex-col justify-between shrink-0 p-4">

        <div className="space-y-8">

          {/* LOGO */}
          <div className="flex items-center gap-3 px-2 mt-2">
            <div className="p-2 rounded-xl bg-green-100 text-green-600">
              <Leaf className="w-5 h-5" />
            </div>

            <div>
              <span className="text-lg font-black tracking-tight text-gray-900">
                Scrap<span className="text-green-600">Sense</span>
              </span>

              <div className="mt-1">
                <span className="text-[10px] bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  User Portal
                </span>
              </div>
            </div>
          </div>

          {/* NAVIGATION */}
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;

              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg"
                      : "text-gray-600 hover:bg-green-50 hover:text-green-700"
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />

                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* FOOTER */}
        <div className="space-y-4 pt-4 border-t border-green-100">

          {/* LOGOUT */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut className="w-5 h-5" />

            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* HEADER */}
        <header className="border-b border-green-100 bg-white/80 backdrop-blur-md px-6 py-4 flex items-center justify-between shadow-sm">

          <div>
            <h1 className="text-lg font-black text-gray-900">
              User Workspace
            </h1>

            <p className="text-xs text-gray-500 mt-1">
              India’s smartest AI-powered e-waste ecosystem
            </p>
          </div>

          <div className="flex items-center gap-4">

            {/* WALLET */}
            <div className="flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full">
              <Coins className="w-4 h-4 text-green-600" />

              <span className="text-sm font-bold text-green-700">
                ₹{user.walletBalance?.toLocaleString?.() || 0}
              </span>
            </div>

            {/* REWARD POINTS */}
            <div className="bg-amber-100 px-4 py-2 rounded-full">
              <span className="text-xs font-bold text-amber-700">
                {user.rewardPoints || 0} PTS
              </span>
            </div>

            {/* PROFILE */}
            <Link
              href="/user/profile"
              className="flex items-center gap-3 border-l border-green-100 pl-4 group"
            >
              <img
                src={user.avatar || "/default-avatar.png"}
                alt="Profile"
                className="w-10 h-10 rounded-full border-2 border-green-200 object-cover group-hover:border-green-500 transition-all"
              />

              <span className="hidden sm:inline text-sm font-semibold text-gray-700 group-hover:text-green-700 transition-all">
                {user.name}
              </span>
            </Link>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* CHAT SUPPORT */}
      <ChatSupport />
    </div>
  );
}