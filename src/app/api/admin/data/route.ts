import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { supabase } from "@/lib/supabase";

const DATA_FILE_PATH = path.join(process.cwd(), "src", "data", "liveStore.json");

function readLocalStore() {
  try {
    if (fs.existsSync(DATA_FILE_PATH)) {
      const fileData = fs.readFileSync(DATA_FILE_PATH, "utf-8");
      return JSON.parse(fileData);
    }
  } catch (err) {
    console.error("Error reading local liveStore.json:", err);
  }
  return { services: [], hospitals: [], labs: [] };
}

function writeLocalStore(data: any) {
  try {
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing local liveStore.json:", err);
  }
}

// Normalize row from Supabase (handles both snake_case and camelCase)
function normalizeService(s: any) {
  const orig = Number(s.original_price ?? s.originalPrice ?? s.price ?? 400);
  const disc = Number(s.discount_percentage ?? s.discountPercentage ?? 20);
  const price = Number(s.price ?? Math.round(orig * (1 - disc / 100)));
  return {
    id: String(s.id),
    name: s.name,
    description: s.description || "",
    price,
    originalPrice: orig,
    discountPercentage: disc,
    icon: s.icon || "Activity",
    badge: s.badge || (disc > 0 ? `${disc}% OFF` : undefined),
    featured: Boolean(s.featured ?? s.is_featured ?? false),
  };
}

function normalizeHospital(h: any) {
  let specs = h.specialities;
  if (typeof specs === "string") {
    try {
      specs = JSON.parse(specs);
    } catch {
      specs = specs.split(",").map((x: string) => x.trim());
    }
  }
  return {
    id: String(h.id),
    name: h.name,
    location: h.location,
    type: h.type,
    specialities: Array.isArray(specs) ? specs : ["Multi-Specialty"],
    doctorNetworkCount: Number(h.doctor_network_count ?? h.doctorNetworkCount ?? 15),
    badge: h.badge || "Connected Partner",
    isFeatured: Boolean(h.is_featured ?? h.isFeatured ?? true),
  };
}

function normalizeLab(l: any) {
  return {
    id: String(l.id),
    name: l.name,
    accreditation: l.accreditation,
    category: l.category,
    description: l.description || "",
    turnaroundTime: l.turnaround_time ?? l.turnaroundTime ?? "6 – 12 Hours",
    badge: l.badge || "Certified Partner",
    isFeatured: Boolean(l.is_featured ?? l.isFeatured ?? true),
  };
}

export async function GET() {
  try {
    const localStore = readLocalStore();

    let services = localStore.services || [];
    let hospitals = localStore.hospitals || [];
    let labs = localStore.labs || [];
    let logoUrl = localStore.logoUrl || "/images/karim-logo.png";
    let globalOffer = localStore.globalOffer || {
      enabled: true,
      discountPercentage: 20,
      badgeText: "20% OFF",
      title: "FLAT 20% OFF ON ALL LAB PACKAGES",
    };
    let databaseSource = "local_cache";

    // 1. Check & query Supabase Database directly
    try {
      const [sbServices, sbHospitals, sbLabs, sbSettings] = await Promise.all([
        supabase.from("services").select("*"),
        supabase.from("hospitals").select("*"),
        supabase.from("partner_labs").select("*"),
        supabase.from("site_settings").select("*"),
      ]);

      if (sbServices.data && sbServices.data.length > 0) {
        services = sbServices.data.map(normalizeService);
        databaseSource = "supabase_database";
      }

      if (sbHospitals.data && sbHospitals.data.length > 0) {
        hospitals = sbHospitals.data.map(normalizeHospital);
        databaseSource = "supabase_database";
      }

      if (sbLabs.data && sbLabs.data.length > 0) {
        labs = sbLabs.data.map(normalizeLab);
        databaseSource = "supabase_database";
      }

      if (sbSettings.data && sbSettings.data.length > 0) {
        sbSettings.data.forEach((row: any) => {
          if (row.key === "logo_url") {
            logoUrl = typeof row.value === "string" ? row.value : row.value;
          }
          if (row.key === "global_offer" && row.value) {
            globalOffer = typeof row.value === "string" ? JSON.parse(row.value) : row.value;
          }
        });
      }

      // If Supabase has live records, keep local store synchronized
      if (databaseSource === "supabase_database") {
        localStore.services = services;
        localStore.hospitals = hospitals;
        localStore.labs = labs;
        localStore.logoUrl = logoUrl;
        localStore.globalOffer = globalOffer;
        localStore.updatedAt = new Date().toISOString();
        writeLocalStore(localStore);
      }
    } catch (sbErr) {
      console.log("Supabase direct query fallback to local cache:", sbErr);
    }

    return NextResponse.json({
      services,
      hospitals,
      labs,
      logoUrl,
      globalOffer,
      databaseSource,
      updatedAt: localStore.updatedAt || new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Failed to load admin data:", error);
    return NextResponse.json(
      { error: "Failed to load admin data", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { services, hospitals, labs, type, item, logoUrl, globalOffer, action, discountPercentage } = body;

    let localStore = readLocalStore();
    localStore.updatedAt = new Date().toISOString();

    // ACTION: Sync all records from local to Supabase database
    if (action === "sync_to_supabase" || action === "seed_database") {
      let syncStatus: any = { services: 0, hospitals: 0, labs: 0, settings: 0, errors: [] };

      try {
        if (localStore.services?.length) {
          const dbServices = localStore.services.map((s: any) => ({
            id: s.id,
            name: s.name,
            description: s.description || "",
            price: Number(s.price),
            original_price: Number(s.originalPrice || s.price),
            discount_percentage: Number(s.discountPercentage || 20),
            icon: s.icon || "Activity",
            badge: s.badge || "20% OFF",
            featured: Boolean(s.featured),
          }));
          const res = await supabase.from("services").upsert(dbServices);
          if (res.error) syncStatus.errors.push(res.error.message);
          else syncStatus.services = dbServices.length;
        }

        if (localStore.hospitals?.length) {
          const dbHospitals = localStore.hospitals.map((h: any) => ({
            id: h.id,
            name: h.name,
            location: h.location,
            type: h.type,
            specialities: h.specialities || [],
            doctor_network_count: Number(h.doctorNetworkCount || 15),
            badge: h.badge || "Connected Partner",
            is_featured: Boolean(h.isFeatured),
          }));
          const res = await supabase.from("hospitals").upsert(dbHospitals);
          if (res.error) syncStatus.errors.push(res.error.message);
          else syncStatus.hospitals = dbHospitals.length;
        }

        if (localStore.labs?.length) {
          const dbLabs = localStore.labs.map((l: any) => ({
            id: l.id,
            name: l.name,
            accreditation: l.accreditation,
            category: l.category,
            description: l.description || "",
            turnaround_time: l.turnaroundTime || "6 – 12 Hours",
            badge: l.badge || "Certified Partner",
            is_featured: Boolean(l.isFeatured),
          }));
          const res = await supabase.from("partner_labs").upsert(dbLabs);
          if (res.error) syncStatus.errors.push(res.error.message);
          else syncStatus.labs = dbLabs.length;
        }

        const settingsRows = [
          { key: "logo_url", value: localStore.logoUrl || "/images/karim-logo.png" },
          { key: "global_offer", value: localStore.globalOffer || { enabled: true, discountPercentage: 20 } },
        ];
        const resSettings = await supabase.from("site_settings").upsert(settingsRows);
        if (resSettings.error) syncStatus.errors.push(resSettings.error.message);
        else syncStatus.settings = settingsRows.length;
      } catch (err: any) {
        syncStatus.errors.push(err.message);
      }

      return NextResponse.json({
        success: syncStatus.errors.length === 0,
        message: syncStatus.errors.length === 0 ? "All database tables synchronized successfully!" : "Database sync encountered notices",
        syncStatus,
        store: localStore,
      });
    }

    // 1. Logo Update
    if (type === "logo" || logoUrl !== undefined) {
      const newLogo = item?.logoUrl || logoUrl || "/images/karim-logo.png";
      localStore.logoUrl = newLogo;

      try {
        await supabase.from("site_settings").upsert([{ key: "logo_url", value: newLogo }]);
      } catch (_) {}
    }

    // 2. Global Offer Update & Price Recalculation
    if (type === "offer" || globalOffer !== undefined || action === "apply_discount") {
      const targetOffer = globalOffer || (item ? item : localStore.globalOffer) || {
        enabled: true,
        discountPercentage: 20,
        badgeText: "20% OFF",
        title: "FLAT 20% OFF ON ALL LAB PACKAGES",
      };

      if (discountPercentage !== undefined) {
        targetOffer.discountPercentage = Number(discountPercentage);
        targetOffer.badgeText = `${discountPercentage}% OFF`;
      }

      localStore.globalOffer = targetOffer;

      // Automatically recalculate test prices in local store and mirror to Supabase
      const discPercent = targetOffer.enabled ? Number(targetOffer.discountPercentage || 20) : 0;
      if (Array.isArray(localStore.services)) {
        localStore.services = localStore.services.map((s: any) => {
          const orig = Number(s.originalPrice || s.original_price || s.price || 400);
          const newPrice = discPercent > 0 ? Math.round(orig * (1 - discPercent / 100)) : orig;
          return {
            ...s,
            originalPrice: orig,
            price: newPrice,
            discountPercentage: discPercent,
            badge: discPercent > 0 ? `${discPercent}% OFF` : "Regular Price",
          };
        });

        // Mirror to Supabase services table
        try {
          const dbServices = localStore.services.map((s: any) => ({
            id: s.id,
            price: s.price,
            original_price: s.originalPrice,
            discount_percentage: s.discountPercentage,
            badge: s.badge,
          }));
          await supabase.from("services").upsert(dbServices);
          await supabase.from("site_settings").upsert([{ key: "global_offer", value: targetOffer }]);
        } catch (_) {}
      }
    }

    // 3. Single Item Save (Service / Hospital / Lab)
    if (type && item) {
      if (type === "service") {
        const orig = Number(item.originalPrice || item.original_price || item.price || 400);
        const disc = Number(item.discountPercentage ?? 20);
        const calculatedPrice = disc > 0 ? Math.round(orig * (1 - disc / 100)) : orig;
        const processedItem = {
          ...item,
          originalPrice: orig,
          price: item.price !== undefined ? item.price : calculatedPrice,
          discountPercentage: disc,
          badge: item.badge || (disc > 0 ? `${disc}% OFF` : undefined),
        };

        const index = localStore.services.findIndex((s: any) => s.id === item.id);
        if (index >= 0) {
          localStore.services[index] = processedItem;
        } else {
          localStore.services.unshift(processedItem);
        }

        try {
          await supabase.from("services").upsert([
            {
              id: processedItem.id,
              name: processedItem.name,
              description: processedItem.description || "",
              price: processedItem.price,
              original_price: processedItem.originalPrice,
              discount_percentage: processedItem.discountPercentage,
              icon: processedItem.icon || "Activity",
              badge: processedItem.badge,
              featured: Boolean(processedItem.featured),
            },
          ]);
        } catch (_) {}
      } else if (type === "hospital") {
        const index = localStore.hospitals.findIndex((h: any) => h.id === item.id);
        if (index >= 0) {
          localStore.hospitals[index] = item;
        } else {
          localStore.hospitals.unshift(item);
        }

        try {
          await supabase.from("hospitals").upsert([
            {
              id: item.id,
              name: item.name,
              location: item.location,
              type: item.type,
              specialities: item.specialities || [],
              doctor_network_count: Number(item.doctorNetworkCount || 15),
              badge: item.badge,
              is_featured: Boolean(item.isFeatured),
            },
          ]);
        } catch (_) {}
      } else if (type === "lab") {
        const index = localStore.labs.findIndex((l: any) => l.id === item.id);
        if (index >= 0) {
          localStore.labs[index] = item;
        } else {
          localStore.labs.unshift(item);
        }

        try {
          await supabase.from("partner_labs").upsert([
            {
              id: item.id,
              name: item.name,
              accreditation: item.accreditation,
              category: item.category,
              description: item.description || "",
              turnaround_time: item.turnaroundTime || "6 – 12 Hours",
              badge: item.badge,
              is_featured: Boolean(item.isFeatured),
            },
          ]);
        } catch (_) {}
      }
    }

    // Persist to local JSON cache file
    writeLocalStore(localStore);

    return NextResponse.json({
      success: true,
      message: "Database updated successfully",
      store: localStore,
    });
  } catch (error: any) {
    console.error("Failed to update database:", error);
    return NextResponse.json(
      { error: "Failed to update database", details: error.message },
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

    const localStore = readLocalStore();
    localStore.updatedAt = new Date().toISOString();

    if (type === "service") {
      localStore.services = localStore.services.filter((s: any) => s.id !== id);
      try {
        await supabase.from("services").delete().eq("id", id);
      } catch (_) {}
    } else if (type === "hospital") {
      localStore.hospitals = localStore.hospitals.filter((h: any) => h.id !== id);
      try {
        await supabase.from("hospitals").delete().eq("id", id);
      } catch (_) {}
    } else if (type === "lab") {
      localStore.labs = localStore.labs.filter((l: any) => l.id !== id);
      try {
        await supabase.from("partner_labs").delete().eq("id", id);
      } catch (_) {}
    }

    writeLocalStore(localStore);

    return NextResponse.json({
      success: true,
      message: `${type} deleted from database`,
      store: localStore,
    });
  } catch (error: any) {
    console.error("Delete operation failed:", error);
    return NextResponse.json(
      { error: "Failed to delete item", details: error.message },
      { status: 500 }
    );
  }
}
