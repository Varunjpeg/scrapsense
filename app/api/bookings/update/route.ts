import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { bookingId, status } = await request.json();

    if (!bookingId || !status) {
      return NextResponse.json({ error: "Booking ID and status are required." }, { status: 400 });
    }

    // 1. Look up active order
    const allBookings = db.getBookings();
    const order = allBookings.find(b => b.id === bookingId);

    if (!order) {
      return NextResponse.json({ error: "Booking order not found." }, { status: 404 });
    }

    // 2. Perform database status update
    const updatedOrder = db.updateBookingStatus(bookingId, status);
    
    let updatedUserRecord = null;
    let updatedRecRecord = null;

    // 3. Award gamified carbon points on successful completion
    if (status === "completed") {
      // Award User: +2 Points & transfer Locked cash value to wallet
      const customer = db.getUserById(order.userId);
      if (customer) {
        const nextWallet = customer.walletBalance + order.price;
        const nextPoints = customer.rewardPoints + 2;
        
        updatedUserRecord = db.updateUserPointsAndWallet(customer.id, nextPoints, nextWallet);
      }

      // Award Recycler: +3 Points for successful e-waste clearance
      if (order.recyclerId) {
        const partner = db.getRecyclers().find(r => r.id === order.recyclerId);
        if (partner) {
          const nextPoints = partner.points + 3;
          updatedRecRecord = db.updateRecyclerPoints(partner.id, nextPoints);
        }
      }
    }

    return NextResponse.json({
      success: true,
      booking: updatedOrder,
      user: updatedUserRecord,
      recycler: updatedRecRecord
    });

  } catch (error: any) {
    return NextResponse.json({ error: "Failed to update order state.", details: error.message }, { status: 500 });
  }
}
