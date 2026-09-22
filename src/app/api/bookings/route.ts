import { NextResponse } from "next/server";
import { sendBookingToHubSpot } from "@/lib/hubspot";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      refCode,
      fullName,
      mobile,
      testType,
      prefDate,
      timeSlot,
      address,
      price,
      originalPrice,
    } = body;

    if (!fullName || !mobile || !testType) {
      return NextResponse.json(
        { error: "Missing required patient fields" },
        { status: 400 }
      );
    }

    // Forward lead directly to HubSpot CRM
    const hubspotResult = await sendBookingToHubSpot({
      refCode: refCode || `#KPL-${Math.floor(100000 + Math.random() * 900000)}`,
      fullName,
      mobile,
      testType,
      prefDate,
      timeSlot,
      address,
      price: price || 0,
      originalPrice: originalPrice || 0,
    });

    return NextResponse.json({
      success: true,
      message: "Booking received & dispatched to CRM",
      hubspot: hubspotResult,
    });
  } catch (error: any) {
    console.error("Booking API Error:", error);
    return NextResponse.json(
      { error: "Failed to process booking", details: error.message },
      { status: 500 }
    );
  }
}
