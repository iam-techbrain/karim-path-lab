# 🏥 Karim Path Lab — Doorstep Diagnostic Pathology Portal

[![Next.js](https://img.shields.io/badge/Next.js-16.2.10-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.3.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![HubSpot CRM](https://img.shields.io/badge/HubSpot_CRM-Leads_&_Contacts-FF7A59?style=for-the-badge&logo=hubspot&logoColor=white)](https://www.hubspot.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.10-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Motion](https://img.shields.io/badge/Motion-13.2.0-FF0055?style=for-the-badge&logo=framer&logoColor=white)](https://motion.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

A modern, high-performance web application and **Digital Booking Pass Generator** built for **Karim Path Lab** operating in **Patna, Bihar**. 

Connects patients directly with certified phlebotomist **Saba Hussain**, Patna's leading specialist doctors, and NABL-accredited diagnostic laboratories with doorstep blood and urine sample pick-up, automated **FLAT 20% OFF** discount calculation, instant pass auto-downloads, and direct **HubSpot CRM** contact & lead synchronization (zero database setup required).

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

### 2. 🎯 HubSpot CRM Lead Integration (Zero Database Required)
- **Zero SQL Database Maintenance**: No Postgres or MySQL setup required.
- **Direct CRM Synchronization**: Whenever a patient books a test or creates a pass, their details (Name, Mobile Number, Test Package, Appointment Date, Time Slot, Doorstep Address, Ref Code, and Pricing) are dispatched to **HubSpot CRM** as a Contact & Lead!
- Supports both **HubSpot Private App Token** (`HUBSPOT_ACCESS_TOKEN`) or **HubSpot Form Submission API** (`HUBSPOT_PORTAL_ID` & `HUBSPOT_FORM_ID`).
- The clinic team can manage patient calls, technician visits, and statuses right from the HubSpot CRM dashboard or mobile app.

### 3. 💳 Dynamic HTML5 Canvas Pass Generator with Auto-Download
- Generates high-definition Retina-grade (`2x DPR`) PNG booking passes on the fly.
- Automatically calculates dynamic height to prevent text or border clipping.
- Displays patient avatar circle with initials, red strikethrough original MRP, Net payable badge, promo code pill, unique reference code, and barcode graphic.
- **⚡ Automatic Instant Download**: Pass image downloads automatically to the patient's device upon submission.
- **Manual Download Button**: Prominent "Click to Download Pass Again (PNG)" button for easy re-downloads.

### 4. ⭐ Interactive Patient Reviews & Rating System
- **Interactive 1 to 5 Star Rating Selector** with real-time hover and click feedback.
- Patient Name, Patna Area/Locality, and review message inputs.
- Instant submission with a **Verified Patient** badge.
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
├── .env.local                          # HubSpot CRM credentials (ignored in Git)
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
    │   └── hubspot.ts                  # HubSpot CRM contacts & form submission integration
    └── types/
        └── booking.ts                  # TypeScript interfaces (TestPackage, BookingPassData, ReviewItem)
```

---

## 🎯 HubSpot CRM Lead Properties Mapping

When a patient books a test, their information is mapped into standard HubSpot CRM Contact properties:

| HubSpot Property | Value Sent | Description |
| :--- | :--- | :--- |
| `firstname` | Patient First Name | Extracted from full name |
| `lastname` | Patient Last Name | Remaining part of full name |
| `phone` | `9876543210` | Patient 10-digit mobile number |
| `address` | Full Address & Landmark | Doorstep collection address in Patna |
| `city` | Patna | Default service city |
| `state` | Bihar | State |
| `message` | Test details, Date, Slot, Fee & Ref Code | Full booking summary note |
| `hs_lead_status` | `NEW` | Status for CRM sales & clinic workflow |
| `created_at` | `TIMESTAMPTZ` | Timestamp of submission |

---

## 🔌 API Endpoints Reference

### `POST /api/bookings`
Dispatches a new patient booking directly to HubSpot CRM and prepares booking data.
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
Fetches all patient reviews ordered by newest first.
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

### 3. Setup Environment Variables (Optional)
Create a `.env.local` file in the root directory:
```env
# HubSpot Private App Access Token (from HubSpot Settings -> Integrations -> Private Apps)
HUBSPOT_ACCESS_TOKEN=your_hubspot_access_token_here

# Or alternatively using HubSpot Form Submission API:
# HUBSPOT_PORTAL_ID=your_portal_id
# HUBSPOT_FORM_ID=your_form_guid
```
*(Note: If you don't add a HubSpot token yet, the application runs automatically with local lead logging and auto-downloads the pass without any errors!)*

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
