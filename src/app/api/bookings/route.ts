import { NextResponse } from "next/server";
import { sql, initDatabase } from "@/lib/db";

export async function POST(request: Request) {
  try {
    await initDatabase();
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
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const discountAmount = (originalPrice || 0) - (price || 0);

    const result = await sql`
      INSERT INTO bookings (
        ref_code,
        patient_name,
        mobile,
        test_type,
        pref_date,
        time_slot,
        address,
        price,
        original_price,
        discount_amount,
        status
      ) VALUES (
        ${refCode},
        ${fullName},
        ${mobile},
        ${testType},
        ${prefDate},
        ${timeSlot},
        ${address},
        ${price || 0},
        ${originalPrice || 0},
        ${discountAmount},
        'CONFIRMED'
      )
      RETURNING *;
    `;

    return NextResponse.json({
      success: true,
      booking: result[0],
    });
  } catch (error: any) {
    console.error("Booking API Error:", error);
    return NextResponse.json(
      { error: "Failed to create booking in database", details: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await initDatabase();
    const bookings = await sql`
      SELECT * FROM bookings
      ORDER BY created_at DESC
      LIMIT 50;
    `;
    return NextResponse.json({ success: true, bookings });
  } catch (error: any) {
    console.error("Fetch Bookings Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings", details: error.message },
      { status: 500 }
    );
  }
}
