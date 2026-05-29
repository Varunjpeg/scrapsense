import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { userId, name, age, phone, address, avatar } = await request.json();

    if (!userId || !name || !phone || !address) {
      return NextResponse.json({ error: "Required fields are missing." }, { status: 400 });
    }

    // 1. Update profile permanently in SQLite equivalent DB
    const updatedUser = db.updateUserProfile(
      userId,
      name,
      parseInt(age) || 18,
      phone,
      address,
      avatar
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found in database." }, { status: 404 });
    }

    const sessionUser = {
      id: updatedUser.id,
      name: updatedUser.name,
      age: updatedUser.age,
      phone: updatedUser.phone,
      address: updatedUser.address,
      email: updatedUser.email,
      role: updatedUser.role,
      rewardPoints: updatedUser.rewardPoints,
      walletBalance: updatedUser.walletBalance,
      avatar: updatedUser.avatar,
      savedLocations: [updatedUser.address]
    };

    // 2. Refresh active session cookie in client browser!
    const response = NextResponse.json({ success: true, user: sessionUser });
    response.cookies.set("scrapsense_session", JSON.stringify(sessionUser), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60
    });

    return response;

  } catch (error: any) {
    return NextResponse.json({ error: "Profile save failed.", details: error.message }, { status: 500 });
  }
}
