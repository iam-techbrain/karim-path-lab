import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#059669",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://karimpathlab.com"),
  title: "Karim Path Lab — Doorstep Diagnostic Testing & Sample Collection in Patna",
  description:
    "Doorstep diagnostic sample collection in Patna, Bihar by Karim Path Lab. NABL-grade CBC, Thyroid, Dengue, Lipid & Full Health Checkups at home with 20% OFF.",
  keywords: [
    "Karim Path Lab Patna",
    "Pathology Lab Patna",
    "Doorstep Diagnostic Test Patna",
    "Home Sample Collection Patna",
    "CBC Test Patna",
    "Thyroid Test Patna",
    "Partner Labs Patna",
  ],
  authors: [{ name: "Karim Path Lab Diagnostic Pathology" }],
  icons: {
    icon: "/images/karim-logo.png",
    shortcut: "/images/karim-logo.png",
    apple: "/images/karim-logo.png",
  },
  openGraph: {
    type: "website",
    url: "https://karimpathlab.com/",
    title: "Karim Path Lab — Doorstep Diagnostic Testing & Sample Collection in Patna",
    description:
      "Certified Doorstep Diagnostic Sample Collection in Patna with FLAT 20% OFF by Karim Path Lab. NABL-grade testing, zero home collection fee, and fast 6-12 hr WhatsApp PDF reports.",
    images: [
      {
        url: "/images/og-preview.png",
        width: 1200,
        height: 630,
        alt: "Karim Path Lab Patna Diagnostic Pathology Doorstep Testing Card",
      },
    ],
    siteName: "Karim Path Lab Patna",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Karim Path Lab — Doorstep Diagnostic Testing & Sample Collection in Patna",
    description:
      "Certified Doorstep Diagnostic Sample Collection in Patna with FLAT 20% OFF by Karim Path Lab. NABL-grade testing, zero home collection fee, and fast WhatsApp PDF reports.",
    images: ["/images/og-preview.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    name: "Karim Path Lab Diagnostic Pathology",
    image: "/images/og-preview.png",
    telephone: "+917277269501",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Patna",
      addressRegion: "Bihar",
      addressCountry: "IN",
    },
    url: "https://karimpathlab.com/",
    priceRange: "₹₹",
    description:
      "Karim Path Lab - NABL-Standard Doorstep Diagnostic Testing & Sample Collection in Patna with fast WhatsApp PDF reports.",
  };

  return (
    <html
      lang="en"
      className={`scroll-smooth ${plusJakarta.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="ambient-bg antialiased selection:bg-emerald-500 selection:text-white font-sans">
        {children}
      </body>
    </html>
  );
}
