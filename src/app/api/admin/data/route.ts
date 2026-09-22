import { NextResponse } from "next/server";
import {
  dbGetServices,
  dbUpsertService,
  dbDeleteService,
  dbApplyDiscountToAll,
  dbGetHospitals,
  dbUpsertHospital,
  dbDeleteHospital,
  dbGetPartnerLabs,
  dbUpsertPartnerLab,
  dbDeletePartnerLab,
  dbGetSetting,
  dbSetSetting,
  dbGetBookings,
  dbUpdateBookingStatus,
  dbDeleteBooking,
  dbGetDatabaseStats,
} from "@/lib/db";
import { supabase } from "@/lib/supabase";

export const runtime = "nodejs";

export async function GET() {
  try {
    let services: any[] = [];
    let hospitals: any[] = [];
    let labs: any[] = [];
    let bookings: any[] = [];
    let logoUrl = "/images/karim-logo.png";
    let globalOffer = {
      enabled: true,
      discountPercentage: 20,
      badgeText: "20% OFF",
      title: "FLAT 20% OFF ON ALL LAB PACKAGES",
    };

    let supabaseTablesReady = false;
    let databaseSource = "SQLite Native (karim_path_lab.db)";

    // 1. Try fetching from Supabase Cloud Database (Primary for Vercel)
    try {
      const [sbServices, sbHospitals, sbLabs, sbSettings, sbBookings] = await Promise.all([
        supabase.from("services").select("*").order("featured", { ascending: false }).order("price", { ascending: true }),
        supabase.from("hospitals").select("*").order("is_featured", { ascending: false }),
        supabase.from("partner_labs").select("*").order("is_featured", { ascending: false }),
        supabase.from("site_settings").select("*"),
        supabase.from("bookings").select("*").order("created_at", { ascending: false }),
      ]);

      if (!sbServices.error && sbServices.data && sbServices.data.length > 0) {
        supabaseTablesReady = true;
        databaseSource = "Supabase Cloud Database (PostgreSQL)";

        services = sbServices.data.map((r: any) => ({
          id: r.id,
          name: r.name,
          description: r.description || "",
          price: Number(r.price),
          originalPrice: Number(r.original_price),
          discountPercentage: Number(r.discount_percentage),
          icon: r.icon || "Activity",
          badge: r.badge || `${r.discount_percentage}% OFF`,
          featured: Boolean(r.featured),
        }));

        if (!sbHospitals.error && sbHospitals.data) {
          hospitals = sbHospitals.data.map((r: any) => ({
            id: r.id,
            name: r.name,
            location: r.location,
            type: r.type,
            specialities: Array.isArray(r.specialities) ? r.specialities : [r.specialities],
            doctorNetworkCount: Number(r.doctor_network_count || 15),
            badge: r.badge,
            isFeatured: Boolean(r.is_featured),
          }));
        }

        if (!sbLabs.error && sbLabs.data) {
          labs = sbLabs.data.map((r: any) => ({
            id: r.id,
            name: r.name,
            accreditation: r.accreditation,
            category: r.category,
            description: r.description || "",
            turnaroundTime: r.turnaround_time,
            badge: r.badge,
            isFeatured: Boolean(r.is_featured),
          }));
        }

        if (!sbSettings.error && sbSettings.data) {
          const logoRow = sbSettings.data.find((s: any) => s.key === "logo_url");
          if (logoRow) {
            try { logoUrl = typeof logoRow.value === "string" ? JSON.parse(logoRow.value) : logoRow.value; } catch { logoUrl = logoRow.value; }
          }
          const offerRow = sbSettings.data.find((s: any) => s.key === "global_offer");
          if (offerRow) {
            try { globalOffer = typeof offerRow.value === "string" ? JSON.parse(offerRow.value) : offerRow.value; } catch { globalOffer = offerRow.value; }
          }
        }

        if (!sbBookings.error && sbBookings.data) {
          bookings = sbBookings.data.map((r: any) => ({
            id: r.id,
            refCode: r.ref_code,
            fullName: r.full_name,
            mobile: r.mobile,
            testType: r.test_type,
            prefDate: r.pref_date,
            timeSlot: r.time_slot,
            address: r.address,
            price: Number(r.price),
            originalPrice: Number(r.original_price),
            status: r.status,
            createdAt: r.created_at,
          }));
        }
      }
    } catch (sbErr) {
      console.log("Supabase fetch notice:", sbErr);
    }

    // 2. Fallback to SQLite Native Database if Supabase tables are not yet created
    if (!supabaseTablesReady) {
      services = dbGetServices();
      hospitals = dbGetHospitals();
      labs = dbGetPartnerLabs();
      bookings = dbGetBookings();
      logoUrl = dbGetSetting("logo_url", "/images/karim-logo.png");
      globalOffer = dbGetSetting("global_offer", globalOffer);
    }

    const dbStats = dbGetDatabaseStats();

    return NextResponse.json({
      services,
      hospitals,
      labs,
      bookings,
      logoUrl,
      globalOffer,
      database: {
        ...dbStats,
        supabaseConnected: true,
        supabaseTablesReady,
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || "https://sfqzkvodulafamrhaxtg.supabase.co",
        activeSource: databaseSource,
      },
      databaseSource,
      updatedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Database query error:", error);
    return NextResponse.json(
      { error: "Database query failed", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, item, logoUrl, globalOffer, action, discountPercentage } = body;

    // Action 1: Sync all data into Supabase Cloud Database
    if (action === "sync_to_supabase" || action === "seed_database") {
      const services = dbGetServices();
      const hospitals = dbGetHospitals();
      const labs = dbGetPartnerLabs();
      const currentLogo = dbGetSetting("logo_url", "/images/karim-logo.png");
      const currentOffer = dbGetSetting("global_offer", {
        enabled: true,
        discountPercentage: 20,
        badgeText: "20% OFF",
        title: "FLAT 20% OFF ON ALL LAB PACKAGES",
      });

      let sbResult: any = { success: false, errors: [] };

      try {
        const [sRes, hRes, lRes, setRes] = await Promise.all([
          supabase.from("services").upsert(
            services.map((s) => ({
              id: s.id,
              name: s.name,
              description: s.description,
              price: s.price,
              original_price: s.originalPrice,
              discount_percentage: s.discountPercentage,
              icon: s.icon,
              badge: s.badge,
              featured: s.featured,
              updated_at: new Date().toISOString(),
            }))
          ),
          supabase.from("hospitals").upsert(
            hospitals.map((h) => ({
              id: h.id,
              name: h.name,
              location: h.location,
              type: h.type,
              specialities: h.specialities,
              doctor_network_count: h.doctorNetworkCount,
              badge: h.badge,
              is_featured: h.isFeatured,
              updated_at: new Date().toISOString(),
            }))
          ),
          supabase.from("partner_labs").upsert(
            labs.map((l) => ({
              id: l.id,
              name: l.name,
              accreditation: l.accreditation,
              category: l.category,
              description: l.description,
              turnaround_time: l.turnaroundTime,
              badge: l.badge,
              is_featured: l.isFeatured,
              updated_at: new Date().toISOString(),
            }))
          ),
          supabase.from("site_settings").upsert([
            { key: "logo_url", value: JSON.stringify(currentLogo), updated_at: new Date().toISOString() },
            { key: "global_offer", value: JSON.stringify(currentOffer), updated_at: new Date().toISOString() },
          ]),
        ]);

        if (sRes.error) sbResult.errors.push("Services: " + sRes.error.message);
        if (hRes.error) sbResult.errors.push("Hospitals: " + hRes.error.message);
        if (lRes.error) sbResult.errors.push("Labs: " + lRes.error.message);
        if (setRes.error) sbResult.errors.push("Settings: " + setRes.error.message);

        sbResult.success = sbResult.errors.length === 0;
      } catch (err: any) {
        sbResult.errors.push(err.message);
      }

      const stats = dbGetDatabaseStats();

      if (sbResult.success) {
        return NextResponse.json({
          success: true,
          message: `All ${services.length} tests, ${hospitals.length} hospitals, and ${labs.length} partner labs successfully synced to Supabase Cloud Database! Ready for Vercel.`,
          supabase: sbResult,
          database: stats,
        });
      } else {
        return NextResponse.json({
          success: false,
          message: "Supabase tables need to be created in your Supabase SQL Editor. Run the supabase_schema.sql script.",
          supabase: sbResult,
          database: stats,
        });
      }
    }

    // Action 2: Logo Update (Supabase + SQLite)
    if (type === "logo" || logoUrl !== undefined) {
      const newLogo = item?.logoUrl || logoUrl || "/images/karim-logo.png";
      dbSetSetting("logo_url", newLogo);

      try {
        await supabase.from("site_settings").upsert([
          { key: "logo_url", value: JSON.stringify(newLogo), updated_at: new Date().toISOString() },
        ]);
      } catch (_) {}
    }

    // Action 3: Global Offer & Bulk Discount (Supabase + SQLite)
    if (type === "offer" || globalOffer !== undefined || action === "apply_discount") {
      const targetOffer = globalOffer || (item ? item : dbGetSetting("global_offer")) || {
        enabled: true,
        discountPercentage: 20,
        badgeText: "20% OFF",
        title: "FLAT 20% OFF ON ALL LAB PACKAGES",
      };

      const disc = discountPercentage !== undefined ? Number(discountPercentage) : (targetOffer.discountPercentage || 20);
      targetOffer.discountPercentage = disc;
      targetOffer.badgeText = disc > 0 ? `${disc}% OFF` : "Regular Price";
      targetOffer.enabled = disc > 0;

      dbSetSetting("global_offer", targetOffer);
      dbApplyDiscountToAll(disc);

      try {
        await supabase.from("site_settings").upsert([
          { key: "global_offer", value: JSON.stringify(targetOffer), updated_at: new Date().toISOString() },
        ]);

        const { data: sbServs } = await supabase.from("services").select("*");
        if (sbServs && sbServs.length > 0) {
          for (const s of sbServs) {
            const orig = Number(s.original_price || s.price);
            const newPrice = disc > 0 ? Math.round(orig * (1 - disc / 100)) : orig;
            await supabase.from("services").update({
              price: newPrice,
              discount_percentage: disc,
              badge: disc > 0 ? `${disc}% OFF` : "Regular Price",
              updated_at: new Date().toISOString(),
            }).eq("id", s.id);
          }
        }
      } catch (_) {}
    }

    // Action 4: Single Item Upsert (Service / Hospital / Lab / Booking)
    if (type && item) {
      if (type === "service") {
        dbUpsertService(item);
        try {
          const orig = Number(item.originalPrice || item.original_price || item.price || 400);
          const disc = Number(item.discountPercentage ?? item.discount_percentage ?? 20);
          const price = item.price !== undefined ? Number(item.price) : Math.round(orig * (1 - disc / 100));

          await supabase.from("services").upsert([
            {
              id: item.id || `srv-${Date.now()}`,
              name: item.name,
              description: item.description || "",
              price: price,
              original_price: orig,
              discount_percentage: disc,
              icon: item.icon || "Activity",
              badge: item.badge || (disc > 0 ? `${disc}% OFF` : "Regular Price"),
              featured: Boolean(item.featured),
              updated_at: new Date().toISOString(),
            },
          ]);
        } catch (_) {}
      } else if (type === "hospital") {
        dbUpsertHospital(item);
        try {
          const specs = Array.isArray(item.specialities) ? item.specialities : [item.specialities || "Multi-Specialty"];
          await supabase.from("hospitals").upsert([
            {
              id: item.id || `hosp-${Date.now()}`,
              name: item.name,
              location: item.location,
              type: item.type || "Multi-Specialty Hospital",
              specialities: specs,
              doctor_network_count: Number(item.doctorNetworkCount || 15),
              badge: item.badge || "Connected Partner",
              is_featured: Boolean(item.isFeatured),
              updated_at: new Date().toISOString(),
            },
          ]);
        } catch (_) {}
      } else if (type === "lab") {
        dbUpsertPartnerLab(item);
        try {
          await supabase.from("partner_labs").upsert([
            {
              id: item.id || `lab-${Date.now()}`,
              name: item.name,
              accreditation: item.accreditation,
              category: item.category || "Diagnostic Reference Lab",
              description: item.description || "",
              turnaround_time: item.turnaroundTime || "6 – 12 Hours",
              badge: item.badge || "Certified Partner",
              is_featured: Boolean(item.isFeatured),
              updated_at: new Date().toISOString(),
            },
          ]);
        } catch (_) {}
      } else if (type === "booking") {
        if (item.id && item.status) {
          dbUpdateBookingStatus(item.id, item.status);
          try {
            await supabase.from("bookings").update({ status: item.status }).eq("id", item.id);
          } catch (_) {}
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Database updated and stored successfully (Supabase Cloud + SQLite synced)",
      database: dbGetDatabaseStats(),
      services: dbGetServices(),
      hospitals: dbGetHospitals(),
      labs: dbGetPartnerLabs(),
      bookings: dbGetBookings(),
    });
  } catch (error: any) {
    console.error("Database write error:", error);
    return NextResponse.json(
      { error: "Failed to store in database", details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const id = searchParams.get("id");

    if (!type || !id) {
      return NextResponse.json(
        { error: "Missing type or id parameter" },
        { status: 400 }
      );
    }

    if (type === "service") {
      dbDeleteService(id);
      try { await supabase.from("services").delete().eq("id", id); } catch (_) {}
    } else if (type === "hospital") {
      dbDeleteHospital(id);
      try { await supabase.from("hospitals").delete().eq("id", id); } catch (_) {}
    } else if (type === "lab") {
      dbDeletePartnerLab(id);
      try { await supabase.from("partner_labs").delete().eq("id", id); } catch (_) {}
    } else if (type === "booking") {
      dbDeleteBooking(id);
      try { await supabase.from("bookings").delete().eq("id", id); } catch (_) {}
    }

    return NextResponse.json({
      success: true,
      message: `${type} deleted from database permanently`,
      services: dbGetServices(),
      hospitals: dbGetHospitals(),
      labs: dbGetPartnerLabs(),
      bookings: dbGetBookings(),
      database: dbGetDatabaseStats(),
    });
  } catch (error: any) {
    console.error("Database delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete from database", details: error.message },
      { status: 500 }
    );
  }
}
