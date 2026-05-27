import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { image } = body; // Base64 or mock image URL

    // We can simulate an AI computer vision analysis that parses the frame
    // and returns high-probability electronic device profiles!
    const mockDevices = [
      {
        name: "iPhone 13 Pro Max",
        category: "Smartphone",
        confidence: 0.94,
        miningYield: { gold: 0.054, copper: 16, silver: 0.28, silicon: 14, plastics: 65 }
      },
      {
        name: "MacBook Pro M1 (13-inch)",
        category: "Laptop",
        confidence: 0.91,
        miningYield: { gold: 0.14, copper: 92, silver: 0.95, silicon: 55, plastics: 410 }
      },
      {
        name: "iPad Air 4",
        category: "Tablet",
        confidence: 0.88,
        miningYield: { gold: 0.065, copper: 34, silver: 0.38, silicon: 22, plastics: 145 }
      },
      {
        name: "Samsung Galaxy S22 Ultra",
        category: "Smartphone",
        confidence: 0.92,
        miningYield: { gold: 0.048, copper: 15, silver: 0.24, silicon: 13, plastics: 60 }
      }
    ];

    // Pick one at random to show diverse AI detections on multiple clicks/scans!
    const selected = mockDevices[Math.floor(Math.random() * mockDevices.length)];

    return NextResponse.json({
      success: true,
      detectedModel: selected.name,
      category: selected.category,
      confidence: selected.confidence,
      miningYield: selected.miningYield,
      urbanMiningInsights: {
        text: `Urban Mining alert: Recycling this ${selected.name} prevents the carbon footprint equivalent of driving 42 km. It contains critical rare-earth elements ready for clean manufacturing.`,
        carbonSavedKg: 12.5,
        metalsPercentage: 24
      }
    });

  } catch (error: any) {
    return NextResponse.json({ error: "Failed to analyze device photo", details: error.message }, { status: 500 });
  }
}
