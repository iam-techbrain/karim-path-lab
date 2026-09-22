# 🏥 Karim Path Lab — Doorstep Diagnostic Pathology Portal

[![Next.js](https://img.shields.io/badge/Next.js-16.2.10-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.3.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Neon Database](https://img.shields.io/badge/Neon_PostgreSQL-Serverless-00E599?style=for-the-badge&logo=postgresql&logoColor=white)](https://neon.tech/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.10-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Motion](https://img.shields.io/badge/Motion-13.2.0-FF0055?style=for-the-badge&logo=framer&logoColor=white)](https://motion.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

A modern, high-performance web application and **Digital Booking Pass Generator** built for **Karim Path Lab** operating in **Patna, Bihar**. 

Connects patients directly with certified phlebotomist **Saba Hussain**, Patna's leading specialist doctors, and NABL-accredited diagnostic laboratories with doorstep blood and urine sample pick-up, automated **FLAT 20% OFF** discount calculation, instant pass downloads, and direct **Neon PostgreSQL** database storage.

---

## 🌟 Key Highlights & Features

### 1. 🔬 NABL-Standard Test Packages & Pricing
- Features 7 comprehensive laboratory packages with automated Flat 20% discount calculations:
  - **Complete Blood Count (CBC)**: ₹320 (MRP: ₹400 · Save ₹80)
  - **Thyroid Profile (T3 T4 TSH)**: ₹480 (MRP: ₹600 · Save ₹120)
  - **Liver Function Test (LFT)**: ₹480 (MRP: ₹600 · Save ₹120)
  - **Kidney Function Test (KFT)**: ₹680 (MRP: ₹850 · Save ₹170)
  - **Lipid Profile**: ₹320 (MRP: ₹400 · Save ₹80)
  - **Dengue & Fever Panel**: ₹800 (MRP: ₹1,000 · Save ₹200)
  - **★ Full Body Health Checkup Package**: ₹2,000 (MRP: ₹2,500 · 60+ Vital Parameters)

### 2. 🗄️ Neon PostgreSQL Database Integration
- Connected via `@neondatabase/serverless` using pooled connection strings.
- **Bookings Persistence**: Automatically stores all patient submissions (patient name, mobile, test package, appointment date, time slot, complete address, price, savings, ref code `#KPL-XXXXXX`, status, timestamp).
- **Reviews & Feedback Persistence**: Live patient ratings (1 to 5 stars) and feedback comments are saved directly into the database and dynamically rendered across all sessions.

### 3. 💳 Dynamic HTML5 Canvas Pass Generator with Auto-Download
- Generates high-definition Retina-grade (`2x DPR`) PNG booking passes on the fly.
- Automatically calculates dynamic height to prevent text or border clipping.
- Displays patient avatar circle with initials, red strikethrough original MRP, Net payable badge, promo code pill, unique reference code, and barcode graphic.
- **⚡ Automatic Instant Download**: Pass image downloads automatically to the patient's device upon submission.
- **Manual Download Button**: Prominent "Click to Download Pass Again (PNG)" button for easy re-downloads.

### 4. ⭐ Interactive Patient Reviews & Rating System
- **Interactive 1 to 5 Star Rating Selector** with real-time hover and click feedback.
- Patient Name, Patna Area/Locality, and review message inputs.
- Instant submission to Neon DB with a **Verified Patient** badge.
- Optional direct WhatsApp forwarding button.

### 5. 🎨 Clinical Emerald Theme & Animations
- Preserves the authentic medical palette: Doctor Emerald (`#059669`, `#047857`, `#065f46`), Clinical Teal, and Light Ambient background (`#f8fafc`).
- Micro-interactions powered by `motion` (Framer Motion).
- Glassmorphism panels, pulsing active phlebotomist indicator (`.live-dot`), and animated SVG ECG heartbeat pulse line.
- Fully responsive on mobile, tablet, and desktop screens with floating mobile action bar.

---

## 📁 Project Directory Structure

```
karim-path-lab/
├── .env.local                          # Neon DB PostgreSQL environment variables
├── .gitignore                          # Git ignore rules (protects credentials & build output)
├── next.config.js                      # Next.js configuration
├── package.json                        # Dependencies (Next 16, React 18, Neon, Motion, Lucide)
├── postcss.config.js                   # PostCSS configuration
├── tailwind.config.js                  # Brand emerald colors & font families
├── tsconfig.json                       # TypeScript compiler settings & path aliases (@/*)
├── public/                             # Static assets
│   └── images/
│       ├── tanrica-medical-laboratory.svg # Official Karim Path Lab logo
│       ├── lab-room.jpg                # State-of-the-art pathology central lab
│       ├── sample-test.jpg             # Sterile collection vials banner
│       ├── herney-microscope.jpg       # Clinical automated microscopy
│       ├── shameersrk-blood-test.jpg   # Phlebotomist Saba Hussain in action
│       └── og-preview.png              # Open Graph & WhatsApp link preview card (1200x630)
└── src/
    ├── app/
    │   ├── api/
    │   │   ├── bookings/
    │   │   │   └── route.ts            # POST: Save booking to DB | GET: Fetch bookings
    │   │   └── reviews/
    │   │       └── route.ts            # GET: Fetch reviews | POST: Insert new review
    │   ├── globals.css                 # Ambient gradients, glassmorphism, ECG animations
    │   ├── layout.tsx                  # Root layout (Google Fonts, SEO metadata, JSON-LD)
    │   └── page.tsx                    # Landing page assembling all modular sections
    ├── components/
    │   ├── TopClinicalBar.tsx          # Phlebotomist active status & direct phone link
    │   ├── Navbar.tsx                  # Sticky glass header with logo & Book Visit CTA
    │   ├── HeroSection.tsx             # Hero typography, trust cards & pass preview
    │   ├── MedicalNetworkBanner.tsx    # Doctor & multi-specialty hospital network
    │   ├── PromoBanner.tsx             # Flat 20% OFF Patna promotional offer
    │   ├── LabTestsGrid.tsx            # Diagnostic test cards & package selector
    │   ├── HowItWorks.tsx              # 4-step home collection process
    │   ├── WhatsAppFeatures.tsx        # Automated digital pass, privacy & inquiry card
    │   ├── PhlebotomistCard.tsx        # Technician Saba Hussain profile & contact
    │   ├── Testimonials.tsx            # Patient reviews with interactive rating form
    │   ├── ContactSection.tsx          # Lab address, contacts & urgent sample alert
    │   ├── Footer.tsx                  # Quick links, copyright & animated ECG line
    │   ├── MobileStickyBar.tsx         # Floating bottom booking bar for mobile
    │   └── BookingModal/
    │       ├── BookingModal.tsx        # Two-step booking modal dialog
    │       └── CanvasPassGenerator.ts  # Retina canvas pass builder & formatter
    ├── data/
    │   └── testsData.ts                # Packages, pricing, initial reviews & lab contacts
    ├── lib/
    │   └── db.ts                       # Neon PostgreSQL client, connection pool & schema init
    └── types/
        └── booking.ts                  # TypeScript interfaces (TestPackage, BookingPassData, ReviewItem)
```

---

## 🗄️ Database Schema (Neon PostgreSQL)

The database tables are automatically initialized by [src/lib/db.ts](file:///e:/Othear/karim-path-lab/src/lib/db.ts) on first execution:

### 1. `bookings` Table
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | `SERIAL PRIMARY KEY` | Unique booking identifier |
| `ref_code` | `VARCHAR(50) UNIQUE` | Unique reference code (e.g. `#KPL-138896`) |
| `patient_name` | `VARCHAR(255)` | Patient's full name |
| `mobile` | `VARCHAR(20)` | 10-digit mobile number |
| `test_type` | `VARCHAR(255)` | Selected diagnostic test or package |
| `pref_date` | `VARCHAR(50)` | Preferred appointment date |
| `time_slot` | `VARCHAR(100)` | Morning, Forenoon, Afternoon, or Evening slot |
| `address` | `TEXT` | Complete doorstep address & landmark in Patna |
| `price` | `INT` | Net discounted fee payable (INR) |
| `original_price`| `INT` | Original MRP fee (INR) |
| `discount_amount`| `INT` | Savings amount (Flat 20% OFF) |
| `status` | `VARCHAR(50)` | Status (`CONFIRMED`, `PENDING`, `COMPLETED`) |
| `created_at` | `TIMESTAMPTZ` | Timestamp of booking creation |

### 2. `reviews` Table
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | `SERIAL PRIMARY KEY` | Unique review identifier |
| `name` | `VARCHAR(255)` | Reviewer / Patient name |
| `location` | `VARCHAR(255)` | Locality in Patna (e.g. Kankarbagh, Boring Road) |
| `rating` | `INT (1-5)` | Star rating given by patient |
| `comment` | `TEXT` | Review feedback comment |
| `verified` | `BOOLEAN` | Verified patient badge flag |
| `created_at` | `TIMESTAMPTZ` | Timestamp of submission |

---

## 🔌 API Endpoints Reference

### `POST /api/bookings`
Creates a new patient booking in Neon PostgreSQL.
- **Request Body**:
  ```json
  {
    "refCode": "#KPL-138896",
    "fullName": "Sudhanshu shekhar",
    "mobile": "7488207433",
    "testType": "Complete Blood Count (CBC)",
    "prefDate": "22 Sep 2026",
    "timeSlot": "Morning (6:00 AM – 9:00 AM)",
    "address": "jaganpura, Patna",
    "price": 320,
    "originalPrice": 400
  }
  ```
- **Response**: `{ "success": true, "booking": { ... } }`

### `GET /api/bookings`
Fetches the latest bookings ordered by creation timestamp.

### `GET /api/reviews`
Fetches all patient reviews from Neon PostgreSQL ordered by newest first.
- **Response**: `{ "success": true, "reviews": [ ... ] }`

### `POST /api/reviews`
Submits a new patient rating and review.
- **Request Body**:
  ```json
  {
    "name": "Amit Kumar",
    "location": "Boring Road, Patna",
    "rating": 5,
    "comment": "Punctual technician and painless blood collection."
  }
  ```
- **Response**: `{ "success": true, "review": { ... } }`

---

## 🚀 Getting Started & Local Development

### 1. Prerequisites
- **Node.js**: v18.0.0 or later (v20+ recommended)
- **npm** or **yarn** / **pnpm**

### 2. Installation
Clone the repository and install the dependencies:
```bash
git clone https://github.com/iam-techbrain/karim-path-lab.git
cd karim-path-lab
npm install
```

### 3. Setup Environment Variables
Create a `.env.local` file in the root directory:
```env
DATABASE_URL=postgresql://neondb_owner:YOUR_PASSWORD@YOUR_HOST-pooler.c-12.us-east-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require
DATABASE_URL_UNPOOLED=postgresql://neondb_owner:YOUR_PASSWORD@YOUR_HOST.c-12.us-east-1.aws.neon.tech/neondb?sslmode=require
POSTGRES_URL=postgresql://neondb_owner:YOUR_PASSWORD@YOUR_HOST-pooler.c-12.us-east-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production
```bash
npm run build
npm run start
```

---

## ☁️ Deployment on Vercel

This application is 100% optimized for **Vercel** deployment:
1. Push your repository to GitHub / GitLab.
2. Import the repository in [Vercel](https://vercel.com).
3. Connect your **Neon PostgreSQL** integration under the Storage tab (or set `DATABASE_URL` in the Environment Variables section).
4. Click **Deploy** — Vercel will automatically build and deploy the Next.js application with zero additional configuration.

---

## 📞 Laboratory & Phlebotomist Contacts

- **Diagnostic Lab**: Karim Path Lab
- **Lead Clinical Phlebotomist**: Saba Hussain
- **Direct Phone**: [+91 72772 69501](tel:+917277269501)
- **Direct Email**: [sabakarim00786@gmail.com](mailto:sabakarim00786@gmail.com)
- **Headquarters Address**: Jethuli, P.O. – Kachchi Dargah, P.S. – Nadi Thana, Patna – 803201, Bihar
- **Operating Hours**: Daily 6:00 AM – 8:00 PM (Doorstep Collection Across All Patna Pincodes)

---

## 📜 License

Created for **Karim Path Lab Diagnostics, Patna, Bihar**. All rights reserved.
