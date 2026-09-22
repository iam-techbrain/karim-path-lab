import { DatabaseSync } from "node:sqlite";
import path from "path";
import fs from "fs";

const DATA_DIR = path.join(process.cwd(), "src", "data");
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, "karim_path_lab.db");

let dbInstance: DatabaseSync | null = null;

export function getDatabase(): DatabaseSync {
  if (!dbInstance) {
    dbInstance = new DatabaseSync(DB_PATH);
    initDatabase(dbInstance);
  }
  return dbInstance;
}

function initDatabase(db: DatabaseSync) {
  // 1. Services Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS services (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      price INTEGER NOT NULL,
      original_price INTEGER NOT NULL,
      discount_percentage INTEGER DEFAULT 20,
      icon TEXT DEFAULT 'Activity',
      badge TEXT DEFAULT '20% OFF',
      featured INTEGER DEFAULT 0,
      updated_at TEXT
    );
  `);

  // 2. Hospitals Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS hospitals (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      location TEXT NOT NULL,
      type TEXT NOT NULL,
      specialities TEXT NOT NULL,
      doctor_network_count INTEGER DEFAULT 15,
      badge TEXT DEFAULT 'Connected Partner',
      is_featured INTEGER DEFAULT 1,
      updated_at TEXT
    );
  `);

  // 3. Partner Labs Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS partner_labs (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      accreditation TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT,
      turnaround_time TEXT DEFAULT '6 – 12 Hours',
      badge TEXT DEFAULT 'Certified Partner',
      is_featured INTEGER DEFAULT 1,
      updated_at TEXT
    );
  `);

  // 4. Site Settings Table (Logo, Offer, Contact)
  db.exec(`
    CREATE TABLE IF NOT EXISTS site_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TEXT
    );
  `);

  // 5. Patient Bookings Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS bookings (
      id TEXT PRIMARY KEY,
      ref_code TEXT NOT NULL,
      full_name TEXT NOT NULL,
      mobile TEXT NOT NULL,
      test_type TEXT NOT NULL,
      pref_date TEXT,
      time_slot TEXT,
      address TEXT,
      price INTEGER,
      original_price INTEGER,
      status TEXT DEFAULT 'Pending Confirmation',
      created_at TEXT
    );
  `);

  // Column migration guards to ensure all fields exist
  try { db.exec("ALTER TABLE services ADD COLUMN updated_at TEXT"); } catch (_) {}
  try { db.exec("ALTER TABLE services ADD COLUMN original_price INTEGER NOT NULL DEFAULT 400"); } catch (_) {}
  try { db.exec("ALTER TABLE services ADD COLUMN discount_percentage INTEGER DEFAULT 20"); } catch (_) {}
  try { db.exec("ALTER TABLE services ADD COLUMN badge TEXT DEFAULT '20% OFF'"); } catch (_) {}

  // Seed default data if empty
  seedIfEmpty(db);
}

function seedIfEmpty(db: DatabaseSync) {
  const serviceCountRow: any = db.prepare("SELECT COUNT(*) as count FROM services").get();
  if (!serviceCountRow || serviceCountRow.count === 0) {
    const insertService = db.prepare(`
      INSERT OR REPLACE INTO services (id, name, description, price, original_price, discount_percentage, icon, badge, featured, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const initialServices = [
      ["cbc", "Complete Blood Count (CBC)", "Hemoglobin, Platelets, WBC, RBC & 24 essential parameters.", 320, 400, 20, "Activity", "20% OFF", 0, new Date().toISOString()],
      ["thyroid", "Thyroid Profile (T3 T4 TSH)", "Complete thyroid hormone assessment for metabolism & weight control.", 480, 600, 20, "FlaskConical", "20% OFF", 0, new Date().toISOString()],
      ["lft", "Liver Function Test (LFT)", "Bilirubin, SGOT, SGPT, Alkaline Phosphatase & Protein Profile.", 480, 600, 20, "TestTube2", "20% OFF", 0, new Date().toISOString()],
      ["kft", "Kidney Function Test (KFT)", "Urea, Uric Acid, Serum Creatinine, Sodium, Potassium & Electrolytes.", 680, 850, 20, "Dna", "20% OFF", 0, new Date().toISOString()],
      ["lipid", "Lipid Profile", "Total Cholesterol, HDL, LDL, VLDL & Triglycerides heart assessment.", 320, 400, 20, "HeartPulse", "20% OFF", 0, new Date().toISOString()],
      ["dengue", "Dengue & Fever Panel", "NS1 Antigen, IgG/IgM Antibodies, Malaria & Complete Platelet check.", 800, 1000, 20, "Thermometer", "20% OFF", 0, new Date().toISOString()],
      ["full-body", "Complete Health Checkup", "60+ Vital Tests: CBC + Thyroid Profile + Liver Function Test (LFT) + Kidney Function Test (KFT) + Lipid Profile & Urine Examination.", 2000, 2500, 20, "Award", "★ MOST POPULAR PACKAGE", 1, new Date().toISOString()],
    ];

    for (const s of initialServices) {
      insertService.run(...s);
    }
  }

  const hospitalCountRow: any = db.prepare("SELECT COUNT(*) as count FROM hospitals").get();
  if (!hospitalCountRow || hospitalCountRow.count === 0) {
    const insertHosp = db.prepare(`
      INSERT OR REPLACE INTO hospitals (id, name, location, type, specialities, doctor_network_count, badge, is_featured, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const initialHospitals = [
      ["hosp-1", "Paras HMRI Hospital", "Raja Bazar, Bailey Road, Patna", "Super Specialty Hospital", JSON.stringify(["Cardiology", "Oncology", "Orthopedics", "Neuro Sciences"]), 45, "NABH Accredited Partner", 1, new Date().toISOString()],
      ["hosp-2", "Ruban Memorial Hospital", "Patliputra Colony, Patna", "Multi-Specialty Hospital", JSON.stringify(["Gastroenterology", "Nephrology", "Urology", "Internal Medicine"]), 30, "Leading Patna Multi-Specialty", 1, new Date().toISOString()],
      ["hosp-3", "Mediversal Multi-Specialty Hospital", "Doctors Colony, Kankarbagh, Patna", "Advanced Multi-Specialty", JSON.stringify(["Critical Care", "Diabetology", "Pulmonology", "General Surgery"]), 28, "Emergency & ICU Tie-up", 1, new Date().toISOString()],
      ["hosp-4", "Ford Hospital & Research Centre", "New Bypass Road, Khemnichak, Patna", "Multi-Specialty & Trauma Centre", JSON.stringify(["Trauma Care", "Cardiology", "General Medicine", "Pediatrics"]), 22, "Specialist Network", 0, new Date().toISOString()],
      ["hosp-5", "AIIMS & PMCH Senior Specialists Network", "Patna City & Phulwarisharif, Patna", "Doctor Consultation & Clinical Tie-up", JSON.stringify(["Advanced Pathology", "Endocrinology", "Rheumatology", "Hematology"]), 50, "Apex Doctor Tie-up", 1, new Date().toISOString()],
    ];

    for (const h of initialHospitals) {
      insertHosp.run(...h);
    }
  }

  const labCountRow: any = db.prepare("SELECT COUNT(*) as count FROM partner_labs").get();
  if (!labCountRow || labCountRow.count === 0) {
    const insertLab = db.prepare(`
      INSERT OR REPLACE INTO partner_labs (id, name, accreditation, category, description, turnaround_time, badge, is_featured, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const initialLabs = [
      ["lab-1", "Dr. Lal PathLabs", "NABL & CAP Certified", "National Reference Laboratory", "India's premier diagnostic chain. Comprehensive 4,500+ diagnostic tests with ultra-sensitive robotic analyzers.", "6 – 12 Hours", "Top Prescribed", 1, new Date().toISOString()],
      ["lab-2", "Thyrocare Technologies", "NABL, CAP & ICMR Approved", "Preventive Care & Hormone Specialist", "World-class automated testing for Thyroid, Lipid, Liver, Vitamin D/B12, and comprehensive preventive packages.", "8 – 14 Hours", "Most Affordable", 1, new Date().toISOString()],
      ["lab-3", "Agilus Diagnostics (SRL)", "NABL Accredited Super-Lab", "Multi-Disciplinary Diagnostic Lab", "Advanced specialized diagnostic testing across Histopathology, Cytology, and molecular pathology.", "8 – 16 Hours", "Doctor Trusted", 1, new Date().toISOString()],
      ["lab-4", "Pathkind Diagnostics", "NABL Certified Bihar Hub", "Rapid Clinical Pathology Lab", "State-of-the-art diagnostic processing hub in Bihar delivering precise routine & specialized clinical reports.", "4 – 8 Hours", "Fast Turnaround", 1, new Date().toISOString()],
      ["lab-5", "Karim Path Lab In-House Center", "NABL Calibrated Equipment", "Express Doorstep Diagnostic Lab", "Direct sterile doorstep sample collection with fast-track emergency testing and instant WhatsApp report delivery.", "4 – 6 Hours", "Express 4 Hr Delivery", 1, new Date().toISOString()],
    ];

    for (const l of initialLabs) {
      insertLab.run(...l);
    }
  }

  const settingsCountRow: any = db.prepare("SELECT COUNT(*) as count FROM site_settings").get();
  if (!settingsCountRow || settingsCountRow.count === 0) {
    const insertSetting = db.prepare(`
      INSERT OR REPLACE INTO site_settings (key, value, updated_at) VALUES (?, ?, ?)
    `);

    insertSetting.run("logo_url", "/images/karim-logo.png", new Date().toISOString());
    insertSetting.run(
      "global_offer",
      JSON.stringify({
        enabled: true,
        discountPercentage: 20,
        badgeText: "20% OFF",
        title: "FLAT 20% OFF ON ALL LAB PACKAGES",
      }),
      new Date().toISOString()
    );
  }
}

// ==========================================
// EXPORTED CRUD OPERATIONS
// ==========================================

export function dbGetServices() {
  const db = getDatabase();
  const rows: any[] = db.prepare("SELECT * FROM services ORDER BY featured DESC, price ASC").all();
  return rows.map((r) => ({
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
}

export function dbUpsertService(item: any) {
  const db = getDatabase();
  const orig = Number(item.originalPrice || item.original_price || item.price || 400);
  const disc = Number(item.discountPercentage ?? item.discount_percentage ?? 20);
  const price = item.price !== undefined ? Number(item.price) : Math.round(orig * (1 - disc / 100));

  const stmt = db.prepare(`
    INSERT INTO services (id, name, description, price, original_price, discount_percentage, icon, badge, featured, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      name=excluded.name,
      description=excluded.description,
      price=excluded.price,
      original_price=excluded.original_price,
      discount_percentage=excluded.discount_percentage,
      icon=excluded.icon,
      badge=excluded.badge,
      featured=excluded.featured,
      updated_at=excluded.updated_at
  `);

  stmt.run(
    item.id || `srv-${Date.now()}`,
    item.name,
    item.description || "",
    price,
    orig,
    disc,
    item.icon || "Activity",
    item.badge || (disc > 0 ? `${disc}% OFF` : undefined),
    item.featured ? 1 : 0,
    new Date().toISOString()
  );

  return dbGetServices();
}

export function dbDeleteService(id: string) {
  const db = getDatabase();
  db.prepare("DELETE FROM services WHERE id = ?").run(id);
  return dbGetServices();
}

export function dbApplyDiscountToAll(discountPercent: number) {
  const db = getDatabase();
  const disc = Number(discountPercent) || 0;

  if (disc > 0) {
    db.prepare(`
      UPDATE services
      SET price = ROUND(original_price * (1.0 - (? / 100.0))),
          discount_percentage = ?,
          badge = ? || '% OFF',
          updated_at = ?
    `).run(disc, disc, String(disc), new Date().toISOString());
  } else {
    db.prepare(`
      UPDATE services
      SET price = original_price,
          discount_percentage = 0,
          badge = 'Regular Price',
          updated_at = ?
    `).run(new Date().toISOString());
  }

  return dbGetServices();
}

export function dbGetHospitals() {
  const db = getDatabase();
  const rows: any[] = db.prepare("SELECT * FROM hospitals ORDER BY is_featured DESC").all();
  return rows.map((r) => {
    let specs = [];
    try {
      specs = JSON.parse(r.specialities);
    } catch {
      specs = [r.specialities];
    }
    return {
      id: r.id,
      name: r.name,
      location: r.location,
      type: r.type,
      specialities: specs,
      doctorNetworkCount: Number(r.doctor_network_count),
      badge: r.badge,
      isFeatured: Boolean(r.is_featured),
    };
  });
}

export function dbUpsertHospital(item: any) {
  const db = getDatabase();
  const specs = Array.isArray(item.specialities) ? JSON.stringify(item.specialities) : JSON.stringify([item.specialities || "Multi-Specialty"]);

  const stmt = db.prepare(`
    INSERT INTO hospitals (id, name, location, type, specialities, doctor_network_count, badge, is_featured, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      name=excluded.name,
      location=excluded.location,
      type=excluded.type,
      specialities=excluded.specialities,
      doctor_network_count=excluded.doctor_network_count,
      badge=excluded.badge,
      is_featured=excluded.is_featured,
      updated_at=excluded.updated_at
  `);

  stmt.run(
    item.id || `hosp-${Date.now()}`,
    item.name,
    item.location,
    item.type || "Multi-Specialty Hospital",
    specs,
    Number(item.doctorNetworkCount || 15),
    item.badge || "Connected Partner",
    item.isFeatured ? 1 : 0,
    new Date().toISOString()
  );

  return dbGetHospitals();
}

export function dbDeleteHospital(id: string) {
  const db = getDatabase();
  db.prepare("DELETE FROM hospitals WHERE id = ?").run(id);
  return dbGetHospitals();
}

export function dbGetPartnerLabs() {
  const db = getDatabase();
  const rows: any[] = db.prepare("SELECT * FROM partner_labs ORDER BY is_featured DESC").all();
  return rows.map((r) => ({
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

export function dbUpsertPartnerLab(item: any) {
  const db = getDatabase();
  const stmt = db.prepare(`
    INSERT INTO partner_labs (id, name, accreditation, category, description, turnaround_time, badge, is_featured, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      name=excluded.name,
      accreditation=excluded.accreditation,
      category=excluded.category,
      description=excluded.description,
      turnaround_time=excluded.turnaround_time,
      badge=excluded.badge,
      is_featured=excluded.is_featured,
      updated_at=excluded.updated_at
  `);

  stmt.run(
    item.id || `lab-${Date.now()}`,
    item.name,
    item.accreditation,
    item.category || "Diagnostic Reference Lab",
    item.description || "",
    item.turnaroundTime || "6 – 12 Hours",
    item.badge || "Certified Partner",
    item.isFeatured ? 1 : 0,
    new Date().toISOString()
  );

  return dbGetPartnerLabs();
}

export function dbDeletePartnerLab(id: string) {
  const db = getDatabase();
  db.prepare("DELETE FROM partner_labs WHERE id = ?").run(id);
  return dbGetPartnerLabs();
}

export function dbGetSetting(key: string, defaultValue: any = null) {
  const db = getDatabase();
  const row: any = db.prepare("SELECT value FROM site_settings WHERE key = ?").get(key);
  if (!row) return defaultValue;
  try {
    return JSON.parse(row.value);
  } catch {
    return row.value;
  }
}

export function dbSetSetting(key: string, value: any) {
  const db = getDatabase();
  const valStr = typeof value === "string" ? value : JSON.stringify(value);
  db.prepare(`
    INSERT INTO site_settings (key, value, updated_at)
    VALUES (?, ?, ?)
    ON CONFLICT(key) DO UPDATE SET value=excluded.value, updated_at=excluded.updated_at
  `).run(key, valStr, new Date().toISOString());
}

export function dbInsertBooking(booking: any) {
  const db = getDatabase();
  const id = booking.id || `bk-${Date.now()}`;
  const refCode = booking.refCode || `#KPL-${Math.floor(100000 + Math.random() * 900000)}`;
  const now = new Date().toISOString();
  db.prepare(`
    INSERT INTO bookings (id, ref_code, full_name, mobile, test_type, pref_date, time_slot, address, price, original_price, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    refCode,
    booking.fullName || booking.name,
    booking.mobile,
    booking.testType || booking.test,
    booking.prefDate || booking.date || "",
    booking.timeSlot || booking.slot || "",
    booking.address || "",
    Number(booking.price || 0),
    Number(booking.originalPrice || 0),
    booking.status || "Confirmed",
    now
  );
  return {
    id,
    refCode,
    fullName: booking.fullName || booking.name,
    mobile: booking.mobile,
    testType: booking.testType || booking.test,
    prefDate: booking.prefDate || booking.date || "",
    timeSlot: booking.timeSlot || booking.slot || "",
    address: booking.address || "",
    price: Number(booking.price || 0),
    originalPrice: Number(booking.originalPrice || 0),
    status: booking.status || "Confirmed",
    createdAt: now,
  };
}

export function dbGetBookings() {
  const db = getDatabase();
  const rows: any[] = db.prepare("SELECT * FROM bookings ORDER BY created_at DESC").all();
  return rows.map((r) => ({
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

export function dbUpdateBookingStatus(id: string, status: string) {
  const db = getDatabase();
  db.prepare("UPDATE bookings SET status = ? WHERE id = ?").run(status, id);
  return dbGetBookings();
}

export function dbDeleteBooking(id: string) {
  const db = getDatabase();
  db.prepare("DELETE FROM bookings WHERE id = ?").run(id);
  return dbGetBookings();
}

export function dbGetDatabaseStats() {
  const db = getDatabase();
  const sRow: any = db.prepare("SELECT COUNT(*) as count FROM services").get();
  const hRow: any = db.prepare("SELECT COUNT(*) as count FROM hospitals").get();
  const lRow: any = db.prepare("SELECT COUNT(*) as count FROM partner_labs").get();
  const bRow: any = db.prepare("SELECT COUNT(*) as count FROM bookings").get();

  return {
    engine: "SQLite Native",
    file: "src/data/karim_path_lab.db",
    status: "Active & Connected",
    counts: {
      services: Number(sRow?.count || 0),
      hospitals: Number(hRow?.count || 0),
      partnerLabs: Number(lRow?.count || 0),
      bookings: Number(bRow?.count || 0),
    },
  };
}
