import { NextResponse } from "next/server";
import { sendBookingToHubSpot } from "@/lib/hubspot";
import { supabase } from "@/lib/supabase";
import { dbInsertBooking } from "@/lib/db";

export const runtime = "nodejs";

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
        { error: "Missing required patient fields (Full Name, Mobile & Test are required)" },
        { status: 400 }
      );
    }

    const bookingRef = refCode || `#KPL-${Math.floor(100000 + Math.random() * 900000)}`;
    const finalPrice = Number(price) || 0;
    const finalOrigPrice = Number(originalPrice) || finalPrice;

    let savedToSupabase = false;
    let savedToSQLite = false;

    // 1. Persist to Supabase cloud database (Primary for Vercel)
    try {
      const { error: sbErr } = await supabase.from("bookings").insert([
        {
          ref_code: bookingRef,
          full_name: fullName,
          mobile,
          test_type: testType,
          pref_date: prefDate || "",
          time_slot: timeSlot || "",
          address: address || "",
          price: finalPrice,
          original_price: finalOrigPrice,
          status: "Confirmed",
        },
      ]);
      if (!sbErr) {
        savedToSupabase = true;
      } else {
        console.log("Supabase bookings notice (tables need setup):", sbErr.message);
      }
    } catch (sbErr: any) {
      console.log("Supabase bookings insert error:", sbErr.message);
    }

    // 2. Persist to SQLite native database (Local fallback / offline cache)
    try {
      dbInsertBooking({
        refCode: bookingRef,
        fullName,
        mobile,
        testType,
        prefDate,
        timeSlot,
        address,
        price: finalPrice,
        originalPrice: finalOrigPrice,
        status: "Confirmed",
      });
      savedToSQLite = true;
    } catch (sqlErr: any) {
      console.log("SQLite bookings insert error:", sqlErr.message);
    }

    // 3. Forward lead directly to HubSpot CRM
    let hubspotResult = null;
    try {
      hubspotResult = await sendBookingToHubSpot({
        refCode: bookingRef,
        fullName,
        mobile,
        testType,
        prefDate,
        timeSlot,
        address,
        price: finalPrice,
        originalPrice: finalOrigPrice,
      });
    } catch (hsErr: any) {
      console.log("HubSpot forward error:", hsErr.message);
    }

    return NextResponse.json({
      success: true,
      refCode: bookingRef,
      message: "Patient sample collection booking confirmed and stored in database!",
      storage: {
        supabaseCloud: savedToSupabase,
        sqliteNative: savedToSQLite,
      },
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
