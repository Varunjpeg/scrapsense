"use client";

import React from "react";
import { Leaf, Award, Recycle, Flame, Compass } from "lucide-react";

const marqueeItems = [
  { text: "Gold: 2.8g recovered per ton of boards", icon: Award, color: "text-amber-400" },
  { text: "Lithium-Ion: 4,500+ batteries diverted", icon: Flame, color: "text-red-400" },
  { text: "Copper: 180kg reclaimed today", icon: Recycle, color: "text-orange-400" },
  { text: "Carbon Offsets: 8,400 kg saved", icon: Leaf, color: "text-emerald-400" },
  { text: "Urban Mining Yields: +42% efficiency", icon: Compass, color: "text-cyan-400" },
];

export default function Marquee() {
  // Duplicate list to make infinite scroll smooth
  const doubleItems = [...marqueeItems, ...marqueeItems, ...marqueeItems, ...marqueeItems];

  return (
    <div className="w-full overflow-hidden bg-emerald-950/20 border-y border-emerald-500/10 py-3 shadow-[inset_0_0_20px_rgba(16,185,129,0.05)]">
      <div className="mask-marquee w-full overflow-hidden whitespace-nowrap relative">
        <div className="inline-flex animate-marquee gap-8">
          {doubleItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="inline-flex items-center gap-2.5 mx-4 text-sm font-semibold tracking-wide text-gray-300 select-none"
              >
                <Icon className={`w-4 h-4 ${item.color}`} />
                <span>{item.text}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/30 ml-6" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
