import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { deviceName, age, isFunctional, physicalCondition, batteryCondition, screenCondition, accessories } = body;

    if (!deviceName) {
      return NextResponse.json({ error: "Device name is required" }, { status: 400 });
    }

    const query = deviceName.toLowerCase();
    
    // Category classification heuristics
    let category = "Smartphone";
    let baseResale = 15000;
    let baseScrap = 800;
    let goldYield = 0.03; // grams
    let copperYield = 12; // grams
    let silverYield = 0.15; // grams
    let siliconYield = 8; // grams
    let plasticsYield = 45; // grams

    if (query.includes("laptop") || query.includes("macbook") || query.includes("thinkpad") || query.includes("dell") || query.includes("hp")) {
      category = "Laptop";
      baseResale = 35000;
      baseScrap = 2500;
      goldYield = 0.12;
      copperYield = 85;
      silverYield = 0.85;
      siliconYield = 45;
      plasticsYield = 350;
    } else if (query.includes("ipad") || query.includes("tablet") || query.includes("galaxy tab")) {
      category = "Tablet";
      baseResale = 20000;
      baseScrap = 1200;
      goldYield = 0.06;
      copperYield = 32;
      silverYield = 0.35;
      siliconYield = 18;
      plasticsYield = 120;
    } else if (query.includes("watch") || query.includes("fitbit") || query.includes("wearable")) {
      category = "Smartwatch";
      baseResale = 8000;
      baseScrap = 300;
      goldYield = 0.015;
      copperYield = 4;
      silverYield = 0.08;
      siliconYield = 5;
      plasticsYield = 15;
    } else if (query.includes("tv") || query.includes("television") || query.includes("monitor")) {
      category = "Household Appliance";
      baseResale = 12000;
      baseScrap = 1500;
      goldYield = 0.02;
      copperYield = 180;
      silverYield = 0.12;
      siliconYield = 25;
      plasticsYield = 800;
    }

    // Diagnostics multipliers
    let resaleMultiplier = 1.0;
    let scrapMultiplier = 1.0;
    let refurbishScore = 90; // starts at 90%

    // Age impact
    if (age === "6-12 Months") {
      resaleMultiplier *= 0.8;
      refurbishScore -= 10;
    } else if (age === "1-2 Years") {
      resaleMultiplier *= 0.6;
      refurbishScore -= 20;
    } else if (age === "Over 2 Years") {
      resaleMultiplier *= 0.4;
      refurbishScore -= 35;
    }

    // Functionality impact
    if (!isFunctional) {
      resaleMultiplier *= 0.15;
      scrapMultiplier *= 1.1; // scrap is slightly higher if components can be melted directly without saving them
      refurbishScore -= 45;
    }

    // Screen impact
    if (screenCondition === "Cracked" || screenCondition === "Scratchy") {
      resaleMultiplier *= 0.5;
      refurbishScore -= 25;
    }

    // Physical impact
    if (physicalCondition === "Damaged") {
      resaleMultiplier *= 0.4;
      refurbishScore -= 25;
    } else if (physicalCondition === "Good") {
      resaleMultiplier *= 0.85;
      refurbishScore -= 5;
    }

    // Battery impact
    if (batteryCondition === "Degraded (Below 80%)" || batteryCondition === "Poor") {
      resaleMultiplier *= 0.75;
      refurbishScore -= 15;
    }

    // Accessories
    const accessoryCount = accessories ? accessories.length : 0;
    resaleMultiplier += (accessoryCount * 0.05); // +5% value for each accessory (charger, box, etc.)

    // Calculations
    const resaleValue = Math.round(baseResale * resaleMultiplier);
    const scrapValue = Math.round(baseScrap * scrapMultiplier);
    const finalRefurbishPossibility = Math.max(5, Math.min(95, refurbishScore));
    const canBeRefurbished = finalRefurbishPossibility >= 45 && isFunctional;

    return NextResponse.json({
      success: true,
      deviceName,
      category,
      valuation: {
        deviceName,
        category,
        age: age || "1-2 Years",
        isFunctional: !!isFunctional,
        physicalCondition: physicalCondition || "Flawless",
        batteryCondition: batteryCondition || "Good",
        screenCondition: screenCondition || "Flawless",
        accessories: accessories || [],
        resaleValue: Math.max(500, resaleValue),
        scrapValue: Math.max(100, scrapValue),
        refurbishPossibility: finalRefurbishPossibility,
        canBeRefurbished,
        miningYield: {
          gold: parseFloat(goldYield.toFixed(3)),
          copper: Math.round(copperYield),
          silver: parseFloat(silverYield.toFixed(3)),
          silicon: Math.round(siliconYield),
          plastics: Math.round(plasticsYield),
        }
      }
    });

  } catch (error: any) {
    return NextResponse.json({ error: "Invalid valuation parameters", details: error.message }, { status: 500 });
  }
}
