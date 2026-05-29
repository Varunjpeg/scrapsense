import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);


export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { step, email, otp, name, age, phone, address, password, role } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    // ==========================================
    // STEP 1: GENERATE & SEND/MOCK EMAIL OTP
    // ==========================================
    if (step === 1) {
      // Check if email already registered
      const existingUser = db.getUserByEmail(email);
      const existingRecycler = db.getRecyclerByEmail(email);

      if (existingUser || existingRecycler) {
        return NextResponse.json({ error: "Email is already registered. Please log in instead." }, { status: 400 });
      }

      // Generate secure 6-digit OTP code
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

      // Save in persistent database
      db.saveOtp(email, generatedOtp);
      const result = await resend.emails.send({
        from: "ScrapSense <onboarding@resend.dev>",
        to: email,
        subject: "Your ScrapSense Verification Code",
        html: `
    <div style="font-family: Arial, sans-serif;">
      <h2>ScrapSense Email Verification</h2>
      <p>Your verification code is:</p>
      <h1>${generatedOtp}</h1>
      <p>This code will expire in 10 minutes.</p>
    </div>
  `,
      });
      console.log("RESEND RESULT:", result);

      // Print in console for extremely easy local testing and investor-demos!
      console.log("\n====================================");
      console.log(`[SCRAPSENSE OTP SENT]`);
      console.log(`Email: ${email}`);
      console.log(`Verification Code: ${generatedOtp}`);
      console.log("====================================\n");

      return NextResponse.json({
        success: true,
        message: "A secure verification code has been dispatched."
      });
    }

    // ==========================================
    // STEP 2: VERIFY OTP CODE
    // ==========================================
    if (step === 2) {
      if (!otp) {
        return NextResponse.json({ error: "Verification code is required." }, { status: 400 });
      }

      const verified = db.verifyOtp(email, otp);
      if (verified) {
        return NextResponse.json({ success: true, message: "Email verification successful." });
      } else {
        return NextResponse.json({ error: "Invalid or expired verification code." }, { status: 400 });
      }
    }

    // ==========================================
    // STEP 3: FINALIZE DATABASE SIGNUP
    // ==========================================
    if (step === 3) {
      if (!name || !password || !phone || !address || !role) {
        return NextResponse.json({ error: "Please fill in all profile fields." }, { status: 400 });
      }

      // Re-verify email is unique
      const existingUser = db.getUserByEmail(email);
      const existingRecycler = db.getRecyclerByEmail(email);
      if (existingUser || existingRecycler) {
        return NextResponse.json({ error: "Email already taken." }, { status: 400 });
      }

      // Create Customer User in relational SQLite DB
      if (role === "customer") {
        const salt = db.generateSalt();
        const passwordHash = db.hashPassword(password, salt);

        const newUser = db.createUser({
          name,
          age: parseInt(age) || 18,
          phone,
          address,
          email,
          passwordHash,
          salt,
          role: "customer"
        });

        const sessionUser = {
          id: newUser.id,
          name: newUser.name,
          age: newUser.age,
          phone: newUser.phone,
          address: newUser.address,
          email: newUser.email,
          role: newUser.role,
          rewardPoints: newUser.rewardPoints,
          walletBalance: newUser.walletBalance,
          avatar: newUser.avatar,
          savedLocations: [newUser.address]
        };

        const response = NextResponse.json({ success: true, user: sessionUser });
        response.cookies.set("scrapsense_session", JSON.stringify(sessionUser), {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60
        });

        return response;
      }

      // Create Recycler / Refurbisher in relational SQLite DB
      if (role === "recycler" || role === "refurbisher") {
        const newRecycler = db.createRecycler({
          businessName: name, // business name
          ownerName: "Manager",
          email,
          phone,
          address,
          licenseNumber: "CPCB-EW-" + Math.floor(1000 + Math.random() * 9000).toString(),
          servicesJson: JSON.stringify(["E-Waste Logistics", "Secondary Dismantling"]),
          isRefurbisher: role === "refurbisher"
        });

        const sessionRec = {
          id: newRecycler.id,
          businessName: newRecycler.businessName,
          ownerName: newRecycler.ownerName,
          email: newRecycler.email,
          phone: newRecycler.phone,
          address: newRecycler.address,
          licenseNumber: newRecycler.licenseNumber,
          ratings: newRecycler.ratings,
          distance: newRecycler.distance,
          points: newRecycler.points,
          services: ["E-Waste Logistics", "Secondary Dismantling"],
          role: newRecycler.isRefurbisher ? "refurbisher" : "recycler"
        };

        const response = NextResponse.json({ success: true, user: sessionRec });
        response.cookies.set("scrapsense_session", JSON.stringify(sessionRec), {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60
        });

        return response;
      }
    }

    return NextResponse.json({ error: "Invalid registration step." }, { status: 400 });

  } catch (error: any) {
    return NextResponse.json({ error: "Registration processing failed.", details: error.message }, { status: 500 });
  }
}
