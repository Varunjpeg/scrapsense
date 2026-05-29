"use client";

import React from "react";
import { Leaf, Award, Recycle, Flame, Compass } from "lucide-react";

const marqueeItems = [
  { text: "Gold: 2.8g recovered per ton of PCBs", icon: Award, color: "text-amber-600" },
  { text: "Lithium-Ion: 4,500+ batteries safely diverted", icon: Flame, color: "text-red-500" },
  { text: "Copper: 180kg reclaimed today", icon: Recycle, color: "text-emerald-600" },
  { text: "Carbon Offsets: 8,400 kg saved permanently", icon: Leaf, color: "text-emerald-500" },
  { text: "Urban Mining Yields: +42% efficiency reached", icon: Compass, color: "text-teal-600" },
];

export default function Marquee() {
  const doubleItems = [...marqueeItems, ...marqueeItems, ...marqueeItems, ...marqueeItems];

  return (
    <div className="w-full overflow-hidden bg-emerald-50/50 border-y border-emerald-500/10 py-3.5 shadow-sm">
      <div className="mask-marquee w-full overflow-hidden whitespace-nowrap relative">
        <div className="inline-flex animate-marquee gap-8">
          {doubleItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="inline-flex items-center gap-2.5 mx-4 text-xs font-bold tracking-wide text-slate-700 select-none"
              >
                <Icon className={`w-4 h-4 ${item.color} shrink-0`} />
                <span>{item.text}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/20 ml-6 shrink-0" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
