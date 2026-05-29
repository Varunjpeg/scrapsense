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

    const totalDuration = 1500;
    const incrementTime = Math.max(Math.floor(totalDuration / end), 12);
    
    const timer = setInterval(() => {
      start += Math.ceil(end / 80);
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
    <div className="glassmorphism rounded-2xl p-5.5 flex items-start gap-4 flex-1 bg-card shadow-sm border border-card-border hover:shadow-md transition-shadow">
      <div className={`p-3.5 rounded-xl ${color} bg-opacity-10 text-emerald-600 border border-emerald-500/10 shrink-0`}>
        <Icon className="w-5.5 h-5.5" />
      </div>
      <div>
        <div className="text-xl font-black tracking-tight text-foreground flex items-baseline gap-0.5">
          <span>{prefix}</span>
          <span>{count.toLocaleString()}</span>
          <span className="text-emerald-500 text-sm font-bold ml-0.5">{suffix}</span>
        </div>
        <div className="text-xs font-bold text-muted-text mt-0.5 uppercase tracking-wider font-mono">{label}</div>
      </div>
    </div>
  );
}

export default function StatsCounter() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full max-w-4xl px-4 my-8 text-left">
      <StatCard
        label="Diverted Landfills"
        value={18340}
        suffix=" kg"
        icon={TreeDeciduous}
        color="bg-emerald-500"
      />
      <StatCard
        label="Payouts Cleared"
        value={485600}
        prefix="₹"
        icon={Coins}
        color="bg-emerald-500"
      />
      <StatCard
        label="Certified Partners"
        value={45}
        suffix="+"
        icon={ShieldCheck}
        color="bg-emerald-500"
      />
    </div>
  );
}
