import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET: Fetch bookings for a logged-in user role
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role");
    const id = searchParams.get("id");

    if (!role || !id) {
      return NextResponse.json({ error: "Role and ID are required to fetch bookings." }, { status: 400 });
    }

    const allBookings = db.getBookings();
    
    // Relational filters
    let filtered = [];
    if (role === "customer") {
      filtered = allBookings.filter(b => b.userId === id);
    } else {
      filtered = allBookings.filter(b => b.recyclerId === id);
    }

    // Map valuation JSON strings back to structures
    const bookingsMapped = filtered.map(b => ({
      ...b,
      valuation: JSON.parse(b.valuationJson)
    }));

    return NextResponse.json({ success: true, bookings: bookingsMapped });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: Book a new collection permanently
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, userName, userPhone, userAddress, deviceName, category, price, timeSlot, recyclerId, valuation } = body;

    if (!userId || !deviceName || !price || !recyclerId) {
      return NextResponse.json({ error: "Missing required booking details." }, { status: 400 });
    }

    // Find recycler name
    const partner = db.getRecyclers().find(r => r.id === recyclerId);

    const newBooking = db.createBooking({
      userId,
      userName,
      userPhone,
      userAddress,
      deviceName,
      category,
      price: parseInt(price),
      status: "pending",
      date: new Date().toISOString().split("T")[0],
      timeSlot,
      recyclerId,
      recyclerName: partner ? partner.businessName : "CPCB Certified Recycler",
      valuationJson: JSON.stringify(valuation)
    });

    const mapped = {
      ...newBooking,
      valuation: JSON.parse(newBooking.valuationJson)
    };

    return NextResponse.json({ success: true, booking: mapped });

  } catch (error: any) {
    return NextResponse.json({ error: "Failed to schedule pickup booking.", details: error.message }, { status: 500 });
  }
}
