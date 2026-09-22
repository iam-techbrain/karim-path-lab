export const SUPABASE_SQL_SCHEMA = `-- ==============================================================================
-- KARIM PATH LAB — COMPLETE SUPABASE DATABASE SCHEMA & INITIAL DATA (VERCEL READY)
-- Run this script in the Supabase SQL Editor (Dashboard > SQL Editor > New Query)
-- Project: https://supabase.com/dashboard/project/sfqzkvodulafamrhaxtg/sql/new
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- TABLE 1: services (Pathology Tests & Health Checkup Packages)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.services (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC NOT NULL,
    original_price NUMERIC NOT NULL,
    discount_percentage NUMERIC DEFAULT 20,
    icon TEXT DEFAULT 'Activity',
    badge TEXT DEFAULT '20% OFF',
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view services" ON public.services;
CREATE POLICY "Public can view services" ON public.services FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can manage services" ON public.services;
CREATE POLICY "Public can manage services" ON public.services FOR ALL USING (true);

INSERT INTO public.services (id, name, description, price, original_price, discount_percentage, icon, badge, featured)
VALUES
    ('cbc', 'Complete Blood Count (CBC)', 'Hemoglobin, Platelets, WBC, RBC & 24 essential parameters.', 320, 400, 20, 'Activity', '20% OFF', false),
    ('thyroid', 'Thyroid Profile (T3 T4 TSH)', 'Complete thyroid hormone assessment for metabolism & weight control.', 480, 600, 20, 'FlaskConical', '20% OFF', false),
    ('lft', 'Liver Function Test (LFT)', 'Bilirubin, SGOT, SGPT, Alkaline Phosphatase & Protein Profile.', 480, 600, 20, 'TestTube2', '20% OFF', false),
    ('kft', 'Kidney Function Test (KFT)', 'Urea, Uric Acid, Serum Creatinine, Sodium, Potassium & Electrolytes.', 680, 850, 20, 'Dna', '20% OFF', false),
    ('lipid', 'Lipid Profile', 'Total Cholesterol, HDL, LDL, VLDL & Triglycerides heart assessment.', 320, 400, 20, 'HeartPulse', '20% OFF', false),
    ('dengue', 'Dengue & Fever Panel', 'NS1 Antigen, IgG/IgM Antibodies, Malaria & Complete Platelet check.', 800, 1000, 20, 'Thermometer', '20% OFF', false),
    ('full-body', 'Complete Health Checkup', '60+ Vital Tests: CBC + Thyroid Profile + Liver Function Test (LFT) + Kidney Function Test (KFT) + Lipid Profile & Urine Examination.', 2000, 2500, 20, 'Award', '★ MOST POPULAR PACKAGE', true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    original_price = EXCLUDED.original_price,
    discount_percentage = EXCLUDED.discount_percentage,
    icon = EXCLUDED.icon,
    badge = EXCLUDED.badge,
    featured = EXCLUDED.featured,
    updated_at = NOW();

-- ==============================================================================
-- TABLE 2: hospitals (Connected Patna Hospitals Network)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.hospitals (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    type TEXT NOT NULL,
    specialities TEXT[] NOT NULL DEFAULT '{}',
    doctor_network_count INTEGER DEFAULT 15,
    badge TEXT DEFAULT 'Connected Partner',
    is_featured BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.hospitals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view hospitals" ON public.hospitals;
CREATE POLICY "Public can view hospitals" ON public.hospitals FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can manage hospitals" ON public.hospitals;
CREATE POLICY "Public can manage hospitals" ON public.hospitals FOR ALL USING (true);

INSERT INTO public.hospitals (id, name, location, type, specialities, doctor_network_count, badge, is_featured)
VALUES
    ('hosp-1', 'Paras HMRI Hospital', 'Raja Bazar, Bailey Road, Patna', 'Super Specialty Hospital', ARRAY['Cardiology', 'Oncology', 'Orthopedics', 'Neuro Sciences'], 45, 'NABH Accredited Partner', true),
    ('hosp-2', 'Ruban Memorial Hospital', 'Patliputra Colony, Patna', 'Multi-Specialty Hospital', ARRAY['Gastroenterology', 'Nephrology', 'Urology', 'Internal Medicine'], 30, 'Leading Patna Multi-Specialty', true),
    ('hosp-3', 'Mediversal Multi-Specialty Hospital', 'Doctors Colony, Kankarbagh, Patna', 'Advanced Multi-Specialty', ARRAY['Critical Care', 'Diabetology', 'Pulmonology', 'General Surgery'], 28, 'Emergency & ICU Tie-up', true),
    ('hosp-4', 'Ford Hospital & Research Centre', 'New Bypass Road, Khemnichak, Patna', 'Multi-Specialty & Trauma Centre', ARRAY['Trauma Care', 'Cardiology', 'General Medicine', 'Pediatrics'], 22, 'Specialist Network', false),
    ('hosp-5', 'AIIMS & PMCH Senior Specialists Network', 'Patna City & Phulwarisharif, Patna', 'Doctor Consultation & Clinical Tie-up', ARRAY['Advanced Pathology', 'Endocrinology', 'Rheumatology', 'Hematology'], 50, 'Apex Doctor Tie-up', true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    location = EXCLUDED.location,
    type = EXCLUDED.type,
    specialities = EXCLUDED.specialities,
    doctor_network_count = EXCLUDED.doctor_network_count,
    badge = EXCLUDED.badge,
    is_featured = EXCLUDED.is_featured,
    updated_at = NOW();

-- ==============================================================================
-- TABLE 3: partner_labs (NABL & Certified Diagnostic Reference Labs)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.partner_labs (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    accreditation TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    turnaround_time TEXT DEFAULT '6 – 12 Hours',
    badge TEXT DEFAULT 'Certified Partner',
    is_featured BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.partner_labs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view partner_labs" ON public.partner_labs;
CREATE POLICY "Public can view partner_labs" ON public.partner_labs FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can manage partner_labs" ON public.partner_labs;
CREATE POLICY "Public can manage partner_labs" ON public.partner_labs FOR ALL USING (true);

INSERT INTO public.partner_labs (id, name, accreditation, category, description, turnaround_time, badge, is_featured)
VALUES
    ('lab-1', 'Dr. Lal PathLabs', 'NABL & CAP Certified', 'National Reference Laboratory', 'India''s premier diagnostic chain. Comprehensive 4,500+ diagnostic tests with ultra-sensitive robotic analyzers.', '6 – 12 Hours', 'Top Prescribed', true),
    ('lab-2', 'Thyrocare Technologies', 'NABL, CAP & ICMR Approved', 'Preventive Care & Hormone Specialist', 'World-class automated testing for Thyroid, Lipid, Liver, Vitamin D/B12, and comprehensive preventive packages.', '8 – 14 Hours', 'Most Affordable', true),
    ('lab-3', 'Agilus Diagnostics (SRL)', 'NABL Accredited Super-Lab', 'Multi-Disciplinary Diagnostic Lab', 'Advanced specialized diagnostic testing across Histopathology, Cytology, and molecular pathology.', '8 – 16 Hours', 'Doctor Trusted', true),
    ('lab-4', 'Pathkind Diagnostics', 'NABL Certified Bihar Hub', 'Rapid Clinical Pathology Lab', 'State-of-the-art diagnostic processing hub in Bihar delivering precise routine & specialized clinical reports.', '4 – 8 Hours', 'Fast Turnaround', true),
    ('lab-5', 'Karim Path Lab In-House Center', 'NABL Calibrated Equipment', 'Express Doorstep Diagnostic Lab', 'Direct sterile doorstep sample collection with fast-track emergency testing and instant WhatsApp report delivery.', '4 – 6 Hours', 'Express 4 Hr Delivery', true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    accreditation = EXCLUDED.accreditation,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    turnaround_time = EXCLUDED.turnaround_time,
    badge = EXCLUDED.badge,
    is_featured = EXCLUDED.is_featured,
    updated_at = NOW();

-- ==============================================================================
-- TABLE 4: site_settings (Logo, Global 20% Offer, Contact Info)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.site_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view site_settings" ON public.site_settings;
CREATE POLICY "Public can view site_settings" ON public.site_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can manage site_settings" ON public.site_settings;
CREATE POLICY "Public can manage site_settings" ON public.site_settings FOR ALL USING (true);

INSERT INTO public.site_settings (key, value)
VALUES
    ('logo_url', '"/images/karim-logo.png"'::jsonb),
    ('global_offer', '{"enabled": true, "discountPercentage": 20, "badgeText": "20% OFF", "title": "FLAT 20% OFF ON ALL LAB PACKAGES"}'::jsonb),
    ('contact_info', '{"name": "Karim Path Lab", "phone": "+91 72772 69501", "phoneRaw": "917277269501", "email": "sabakarim00786@gmail.com", "address": "Jethuli, P.O. – Kachchi Dargah, P.S. – Nadi Thana, Patna – 803201, Bihar"}'::jsonb)
ON CONFLICT (key) DO UPDATE SET
    value = EXCLUDED.value,
    updated_at = NOW();

-- ==============================================================================
-- TABLE 5: bookings (Doorstep Sample Collection Leads)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ref_code TEXT NOT NULL,
    full_name TEXT NOT NULL,
    mobile TEXT NOT NULL,
    test_type TEXT NOT NULL,
    pref_date TEXT,
    time_slot TEXT,
    address TEXT,
    price NUMERIC,
    original_price NUMERIC,
    status TEXT DEFAULT 'Pending Confirmation',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can insert bookings" ON public.bookings;
CREATE POLICY "Public can insert bookings" ON public.bookings FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public can view bookings" ON public.bookings;
CREATE POLICY "Public can view bookings" ON public.bookings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can manage bookings" ON public.bookings;
CREATE POLICY "Public can manage bookings" ON public.bookings FOR ALL USING (true);
`;
