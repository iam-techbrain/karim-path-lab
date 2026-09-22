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

export async function GET() {
  try {
    const localStore = readLocalStore();

    // Attempt to also sync from Supabase if tables exist
    let services = localStore.services || [];
    let hospitals = localStore.hospitals || [];
    let labs = localStore.labs || [];

    try {
      const [sbServices, sbHospitals, sbLabs] = await Promise.all([
        supabase.from("services").select("*"),
        supabase.from("hospitals").select("*"),
        supabase.from("partner_labs").select("*"),
      ]);

      if (sbServices.data && sbServices.data.length > 0) {
        services = sbServices.data;
      }
      if (sbHospitals.data && sbHospitals.data.length > 0) {
        hospitals = sbHospitals.data;
      }
      if (sbLabs.data && sbLabs.data.length > 0) {
        labs = sbLabs.data;
      }
    } catch (sbErr) {
      // Supabase tables might not exist yet; gracefully fallback to local store
      console.log("Supabase query fallback to local store:", sbErr);
    }

    return NextResponse.json({
      services,
      hospitals,
      labs,
      logoUrl: localStore.logoUrl || "/images/karim-logo.png",
      globalOffer: localStore.globalOffer || {
        enabled: true,
        discountPercentage: 20,
        badgeText: "20% OFF",
        title: "FLAT 20% OFF ON ALL LAB PACKAGES",
      },
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

    // 1. Logo Update
    if (type === "logo" || logoUrl !== undefined) {
      localStore.logoUrl = item?.logoUrl || logoUrl || "/images/karim-logo.png";
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

      // Automatically recalculate test prices if offer is enabled and discount is active
      const discPercent = targetOffer.enabled ? Number(targetOffer.discountPercentage || 20) : 0;
      if (Array.isArray(localStore.services)) {
        localStore.services = localStore.services.map((s: any) => {
          const orig = Number(s.originalPrice) || Number(s.price) || 400;
          const newPrice = discPercent > 0 ? Math.round(orig * (1 - discPercent / 100)) : orig;
          return {
            ...s,
            originalPrice: orig,
            price: newPrice,
            discountPercentage: discPercent,
            badge: discPercent > 0 ? `${discPercent}% OFF` : "Regular Price",
          };
        });
      }
    }

    // 3. Bulk Services / Hospitals / Labs
    if (services && hospitals && labs) {
      localStore.services = services;
      localStore.hospitals = hospitals;
      localStore.labs = labs;
    } else if (type && item) {
      if (type === "service") {
        const orig = Number(item.originalPrice) || Number(item.price) || 400;
        const disc = Number(item.discountPercentage) ?? 20;
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
      } else if (type === "hospital") {
        const index = localStore.hospitals.findIndex((h: any) => h.id === item.id);
        if (index >= 0) {
          localStore.hospitals[index] = item;
        } else {
          localStore.hospitals.unshift(item);
        }
      } else if (type === "lab") {
        const index = localStore.labs.findIndex((l: any) => l.id === item.id);
        if (index >= 0) {
          localStore.labs[index] = item;
        } else {
          localStore.labs.unshift(item);
        }
      }
    }

    // Persist to local JSON file
    writeLocalStore(localStore);

    // Attempt to mirror write to Supabase asynchronously if configured
    try {
      if (type === "service" && item) {
        await supabase.from("services").upsert([item]);
      } else if (type === "hospital" && item) {
        await supabase.from("hospitals").upsert([item]);
      } else if (type === "lab" && item) {
        await supabase.from("partner_labs").upsert([item]);
      }
    } catch (sbErr) {
      console.log("Supabase upsert non-blocking notice:", sbErr);
    }

    return NextResponse.json({
      success: true,
      message: "Data updated successfully",
      store: localStore,
    });
  } catch (error: any) {
    console.error("Failed to update data:", error);
    return NextResponse.json(
      { error: "Failed to update data", details: error.message },
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
      message: `${type} deleted successfully`,
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
