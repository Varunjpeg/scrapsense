import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: Request) {
  try {
    // =====================================================
    // REQUEST BODY
    // =====================================================

    const body = await request.json();
    const { image } = body;

    // =====================================================
    // VALIDATE IMAGE
    // =====================================================

    if (!image) {
      return NextResponse.json(
        { error: "Image payload is required" },
        { status: 400 }
      );
    }

    if (!image.startsWith("data:image")) {
      return NextResponse.json(
        { error: "Invalid image format" },
        { status: 400 }
      );
    }

    // =====================================================
    // API KEY
    // =====================================================

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error("Missing GEMINI_API_KEY");

      return NextResponse.json({
        success: true,
        identified: false,
        fallbackMode: true,
        detectedModel: "Unknown Device",
        brand: "Unknown",
        category: "unknown",
        confidence: 0.1,
        physicalCondition: "Unknown",
        refurbishable: false,
        recyclable: true,
        recyclabilityScore: 0,
        miningYield: null,
        urbanMiningInsights: {
          text: "AI service is temporarily unavailable.",
          carbonSavedKg: 0,
          metalsPercentage: 0
        }
      });
    }

    // =====================================================
    // MIME TYPE
    // =====================================================

    const mimeMatch = image.match(/^data:(image\/\w+);base64,/);

    const mimeType = mimeMatch
      ? mimeMatch[1]
      : "image/jpeg";

    const allowedMimeTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp"
    ];

    if (!allowedMimeTypes.includes(mimeType)) {
      return NextResponse.json(
        { error: "Unsupported image format" },
        { status: 400 }
      );
    }

    // =====================================================
    // REMOVE BASE64 HEADER
    // =====================================================

    const base64Data = image.replace(
      /^data:image\/\w+;base64,/,
      ""
    );

    console.log(
      "Image received:",
      image.slice(0, 50)
    );

    console.log(
      "Base64 length:",
      base64Data.length
    );

    // =====================================================
    // IMAGE SIZE LIMIT
    // =====================================================

    const imageSizeInBytes = Buffer.from(
      base64Data,
      "base64"
    ).length;

    if (imageSizeInBytes > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Image exceeds 5MB limit" },
        { status: 400 }
      );
    }

    // =====================================================
    // GEMINI SETUP
    // =====================================================

    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
      model: "gemini-3.5-flash"
    });

    // =====================================================
    // IMAGE PART
    // =====================================================

    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType
      }
    };

    // =====================================================
    // PROMPT
    // =====================================================

    const prompt = `
You are a professional AI electronic waste recognition engine.

Analyze the uploaded image carefully.

Return ONLY valid raw JSON.

{
  "detectedModel": "Exact device model only if confidently identifiable",
  "brand": "Brand name",
  "category": "phone | laptop | tablet | router | tv | charger | keyboard | accessory | monitor | gpu | motherboard | cpu | battery | pcb | ram | appliance | smartwatch | speaker | printer | console | remote | unknown",
  "physicalCondition": "Flawless | Good | Damaged",
  "confidence": 0.0,
  "refurbishable": true,
  "recyclable": true,
  "recyclabilityScore": 0,
  "sustainabilityInsight": "2 sentence sustainability explanation"
}

Rules:
- Never hallucinate Apple devices
- Never guess device models
- If uncertain return category="unknown"
- Confidence must be realistic
- Return ONLY JSON
`;

    // =====================================================
    // GEMINI CALL
    // =====================================================

    let parsed: any = null;

    try {
      const result = await model.generateContent([
        prompt,
        imagePart
      ]);

      const textResponse =
        result.response.text();

      const jsonText = textResponse
        .replace(/```json/gi, "")
        .replace(/```/gi, "")
        .trim();

      const match = jsonText.match(
        /\{[\s\S]*\}/
      );

      if (!match) {
        throw new Error(
          "No valid JSON returned"
        );
      }

      parsed = JSON.parse(match[0]);

    } catch (genError: any) {

      console.error(
        "Gemini Vision Error:",
        genError
      );

      // =================================================
      // FALLBACK MODE
      // =================================================

      return NextResponse.json({
        success: true,
        identified: false,
        fallbackMode: true,

        detectedModel: "Electronic Device",
        brand: "Unknown",

        category: "unknown",

        confidence: 0.35,

        physicalCondition: "Good",

        refurbishable: true,

        recyclable: true,

        recyclabilityScore: 45,

        miningYield: {
          gold: 0.02,
          copper: 15,
          silver: 0.1,
          silicon: 10,
          plastics: 50,
          aluminum: 20
        },

        urbanMiningInsights: {
          text:
            "AI quota exceeded. Running fallback eco-analysis mode. This device still contains recyclable metals and recoverable materials.",

          carbonSavedKg: 8.5,

          metalsPercentage: 18
        }
      });
    }

    // =====================================================
    // NORMALIZE CATEGORY
    // =====================================================

    parsed.category = parsed.category
      ?.toLowerCase()
      ?.trim();

    const validCategories = [
      "phone",
      "laptop",
      "tablet",
      "router",
      "tv",
      "charger",
      "keyboard",
      "accessory",
      "monitor",
      "gpu",
      "motherboard",
      "cpu",
      "battery",
      "pcb",
      "ram",
      "appliance",
      "smartwatch",
      "speaker",
      "printer",
      "console",
      "remote",
      "unknown"
    ];

    if (
      !validCategories.includes(
        parsed.category
      )
    ) {
      parsed.category = "unknown";
    }

    // =====================================================
    // CONFIDENCE CHECK
    // =====================================================

    if (
      !parsed.confidence ||
      parsed.confidence < 0.45
    ) {
      return NextResponse.json({
        success: true,
        identified: false,

        detectedModel:
          "Unknown Device",

        category: "unknown",

        confidence:
          parsed.confidence || 0.1,

        physicalCondition:
          "Unknown",

        refurbishable: false,

        recyclable: true,

        recyclabilityScore: 0,

        miningYield: null,

        urbanMiningInsights: {
          text:
            "The uploaded image was too unclear for reliable identification.",

          carbonSavedKg: 0,

          metalsPercentage: 0
        }
      });
    }

    // =====================================================
    // MATERIAL YIELDS
    // =====================================================

    const yieldsDataset: Record<
      string,
      any
    > = {
      laptop: {
        gold: 0.14,
        copper: 92,
        silver: 0.95,
        silicon: 55,
        plastics: 410,
        aluminum: 650
      },

      phone: {
        gold: 0.054,
        copper: 16,
        silver: 0.28,
        silicon: 14,
        plastics: 65,
        aluminum: 45
      },

      tablet: {
        gold: 0.04,
        copper: 22,
        silver: 0.2,
        silicon: 20,
        plastics: 80,
        aluminum: 60
      },

      monitor: {
        gold: 0.01,
        copper: 32,
        silver: 0.08,
        silicon: 8,
        plastics: 420,
        aluminum: 120
      },

      gpu: {
        gold: 0.08,
        copper: 110,
        silver: 0.55,
        silicon: 38,
        plastics: 45,
        aluminum: 280
      },

      unknown: {
        gold: 0,
        copper: 0,
        silver: 0,
        silicon: 0,
        plastics: 0,
        aluminum: 0
      }
    };

    const activeYield =
      yieldsDataset[parsed.category] ||
      yieldsDataset["unknown"];

    // =====================================================
    // SUCCESS RESPONSE
    // =====================================================

    return NextResponse.json({
      success: true,
      identified: true,

      detectedModel:
        parsed.detectedModel ||
        "Unknown Device",

      brand:
        parsed.brand || "Unknown",

      category: parsed.category,

      confidence:
        parsed.confidence,

      physicalCondition:
        parsed.physicalCondition ||
        "Unknown",

      refurbishable:
        parsed.refurbishable ?? false,

      recyclable:
        parsed.recyclable ?? true,

      recyclabilityScore:
        parsed.recyclabilityScore ??
        0,

      miningYield: activeYield,

      urbanMiningInsights: {
        text:
          parsed.sustainabilityInsight ||
          "Recycling electronic waste helps recover valuable materials and reduce landfill waste.",

        carbonSavedKg:
          parsed.category === "laptop"
            ? 44.5
            : parsed.category ===
              "phone"
            ? 12.2
            : 18.5,

        metalsPercentage: 24
      }
    });

  } catch (error: any) {

    console.error(
      "AI IMAGE ANALYSIS ERROR:"
    );

    console.error(error);

    return NextResponse.json(
      {
        error:
          "Failed to analyze device photo",

        details:
          error?.message ||
          "Unknown error"
      },
      { status: 500 }
    );
  }
}