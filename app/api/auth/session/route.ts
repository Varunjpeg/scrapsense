import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("scrapsense_session");

    if (sessionCookie && sessionCookie.value) {
      const session = JSON.parse(sessionCookie.value);
      return NextResponse.json({ success: true, session });
    }

    return NextResponse.json({ success: true, session: null });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const cookieStore = await cookies();
    
    // Clear session cookie
    const response = NextResponse.json({ success: true, message: "Logged out successfully." });
    response.cookies.delete("scrapsense_session");
    
    return response;
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
