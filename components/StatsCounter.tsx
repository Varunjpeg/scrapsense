"use client";

import React, { useEffect, useState } from "react";
import { ShieldCheck, Coins, TreeDeciduous } from "lucide-react";

interface StatItemProps {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

function StatCard({ label, value, prefix = "", suffix = "", icon: Icon, color }: StatItemProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;

    const totalDuration = 2000; // 2 seconds
    const incrementTime = Math.max(Math.floor(totalDuration / end), 15);
    
    const timer = setInterval(() => {
      start += Math.ceil(end / 100);
      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(start);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className="glassmorphism glassmorphism-hover rounded-2xl p-6 flex items-start gap-4 flex-1">
      <div className={`p-3.5 rounded-xl ${color} bg-opacity-10 text-emerald-400 border border-white/5`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <div className="text-2xl font-bold tracking-tight text-white flex items-baseline gap-0.5">
          <span>{prefix}</span>
          <span>{count.toLocaleString()}</span>
          <span className="text-emerald-400 text-lg font-semibold">{suffix}</span>
        </div>
        <div className="text-sm font-medium text-gray-400 mt-1">{label}</div>
      </div>
    </div>
  );
}

export default function StatsCounter() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl px-6 my-10">
      <StatCard
        label="E-Waste Safely Diverted"
        value={18340}
        suffix=" kg"
        icon={TreeDeciduous}
        color="bg-emerald-500"
      />
      <StatCard
        label="Instant Payouts Processed"
        value={485600}
        prefix="₹"
        icon={Coins}
        color="bg-amber-500"
      />
      <StatCard
        label="Certified Partners Online"
        value={45}
        suffix="+"
        icon={ShieldCheck}
        color="bg-cyan-500"
      />
    </div>
  );
}
