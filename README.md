# 🏥 Bharat Bio. Chem. — Doorstep Diagnostic Pathology Portal

A modern, high-performance web portal and **Digital Booking Pass Generator** built for **Bharat Bio. Chem. Diagnostic Pathology Lab** operating in **Patna, Bihar**. 

This application allows patients to browse NABL-standard health checkup packages, select collection time slots, receive instant flat discounts (10%–20% OFF), and generate high-contrast **Digital Diagnostic Passes** downloadable as images or shareable via WhatsApp.

---

## 🌟 Key Features

- 🔬 **NABL-Standard Testing Showcase**: Features comprehensive lab packages including CBC, Thyroid Profile, LFT, KFT, Lipid Profile, Dengue Panel, and Full Body Health Checkups.
- 📱 **Open Graph & Twitter Mobile Preview Cards**: Fully configured `og:image`, `og:title`, `og:description`, and `twitter:card` tags so sharing the portal link on WhatsApp, Twitter/X, or Facebook renders a rich, mobile-optimized preview card (`1200x630`).
- 💳 **Dynamic HTML5 Canvas Card Generator**: 
  - Generates high-definition Retina-grade PNG booking passes dynamically.
  - Automatically calculates canvas height to prevent layout clipping.
  - Includes patient initials badge, reference code, barcode graphic, and complete address breakdown.
- 🏷️ **Automated Price & Discount Calculator**: Displays MRP, discount savings (Flat 10% OFF), and net payable amounts across UI cards and generated passes.
- 📱 **WhatsApp Direct Dispatch**: One-click booking pass forwarding and site link sharing to Phlebotomist **Saba Hussain (+91 72772 69501)** via Web Share API or WhatsApp direct links.
- 🎨 **Clinical Emerald Theme**: Light, sterile, medical-grade aesthetic utilizing glassmorphism, smooth animations, and clean gradients.
- 📱 **100% Mobile-First Responsive**: Tailored layout for mobile devices, tablets, and desktop displays.

---

## 📁 Project Structure

```
patho-card/
├── index.html                           # Main web application & Canvas card engine
├── images/                              # Diagnostic & Lab branding assets
│   ├── tanrica-medical-laboratory.svg   # Official laboratory brand logo
│   ├── og-preview.png                   # Open Graph & WhatsApp link preview banner (1200x630)
│   ├── lab-room.jpg                     # High-res central lab room showcase
│   ├── sample-test.jpg                  # Sterile sample collection vials banner
│   ├── herney-microscope.jpg            # Automated pathology equipment image
│   └── shameersrk-blood-test.jpg        # Phlebotomy technician showcase
└── README.md                            # Project documentation
```

---

## 🚀 How to Run Locally

Since this is a lightweight, zero-dependency static web application, no complex build setup is required.

### Method 1: Direct File Open
Simply double-click `index.html` or open it in any web browser (Chrome, Edge, Firefox, Safari).

### Method 2: Live Server (Recommended)
Using Node.js static server or VS Code Live Server:
```bash
# Using npx serve
npx serve .

# Or using Python HTTP Server
python -m http.server 8000
```
Then open `http://localhost:8000` in your browser.

---

## 🛠️ Technology Stack

- **Markup & Logic**: HTML5, Modern Vanilla JavaScript (ES6+)
- **Styling Framework**: Tailwind CSS (via CDN) + Custom CSS Utility Classes
- **Graphics Engine**: HTML5 2D Canvas API (High DPI Device Pixel Ratio Scaling)
- **Typography**: Google Fonts (*Plus Jakarta Sans*, *Space Grotesk*, *JetBrains Mono*)
- **Icons & Graphics**: Embedded Inline SVGs + High Quality WebP/JPG Media

---

## 📞 Laboratory & Phlebotomy Contact

- **Lab Name**: Bharat Bio. Chem. Diagnostics
- **Location**: Patna, Bihar
- **Lead Phlebotomist**: Saba Hussain
- **Contact Number**: [+91 72772 69501](tel:+917277269501)
- **Sample Collection**: Doorstep Blood & Urine Home Collection Available Daily

---

## 📜 License

Created for Bharat Bio. Chem. Diagnostics, Patna. All rights reserved.
