import { TestPackage, ReviewItem } from '../types/booking';

export const LAB_CONTACT = {
  name: "Karim Path Lab",
  tagline: "Diagnostic Pathology Lab · Patna",
  phlebotomist: "Saba Hussain",
  phone: "+91 72772 69501",
  phoneRaw: "917277269501",
  email: "sabakarim00786@gmail.com",
  address: "Jethuli, P.O. – Kachchi Dargah, P.S. – Nadi Thana, Patna – 803201, Bihar",
  hours: "Daily 6:00 AM – 8:00 PM",
  promoCode: "PATNA20",
  discountPercent: 20,
};

export const TEST_PACKAGES: TestPackage[] = [
  {
    id: "cbc",
    name: "Complete Blood Count (CBC)",
    description: "Hemoglobin, Platelets, WBC, RBC & 24 essential parameters.",
    price: 320,
    originalPrice: 400,
    discountPercentage: 20,
    icon: "Activity",
    badge: "20% OFF",
  },
  {
    id: "thyroid",
    name: "Thyroid Profile (T3 T4 TSH)",
    description: "Complete thyroid hormone assessment for metabolism & weight control.",
    price: 480,
    originalPrice: 600,
    discountPercentage: 20,
    icon: "FlaskConical",
    badge: "20% OFF",
  },
  {
    id: "lft",
    name: "Liver Function Test (LFT)",
    description: "Bilirubin, SGOT, SGPT, Alkaline Phosphatase & Protein Profile.",
    price: 480,
    originalPrice: 600,
    discountPercentage: 20,
    icon: "TestTube2",
    badge: "20% OFF",
  },
  {
    id: "kft",
    name: "Kidney Function Test (KFT)",
    description: "Urea, Uric Acid, Serum Creatinine, Sodium, Potassium & Electrolytes.",
    price: 680,
    originalPrice: 850,
    discountPercentage: 20,
    icon: "Dna",
    badge: "20% OFF",
  },
  {
    id: "lipid",
    name: "Lipid Profile",
    description: "Total Cholesterol, HDL, LDL, VLDL & Triglycerides heart assessment.",
    price: 320,
    originalPrice: 400,
    discountPercentage: 20,
    icon: "HeartPulse",
    badge: "20% OFF",
  },
  {
    id: "dengue",
    name: "Dengue & Fever Panel",
    description: "NS1 Antigen, IgG/IgM Antibodies, Malaria & Complete Platelet check.",
    price: 800,
    originalPrice: 1000,
    discountPercentage: 20,
    icon: "Thermometer",
    badge: "20% OFF",
  },
  {
    id: "full-body",
    name: "Complete Health Checkup",
    description: "60+ Vital Tests: CBC + Thyroid Profile + Liver Function Test (LFT) + Kidney Function Test (KFT) + Lipid Profile & Urine Examination.",
    price: 2000,
    originalPrice: 2500,
    discountPercentage: 20,
    icon: "Award",
    badge: "★ MOST POPULAR PACKAGE",
    featured: true,
  },
];

export const INITIAL_REVIEWS: ReviewItem[] = [
  {
    id: "rev-1",
    name: "Rajesh Verma",
    location: "Kankarbagh, Patna",
    rating: 5,
    comment: "Saba arrived right on time at 7 AM in Kankarbagh. Blood sample collection was completely painless and I got my CBC report on WhatsApp by evening!",
    date: "2 days ago",
    verified: true,
  },
  {
    id: "rev-2",
    name: "Sneha Sharma",
    location: "Boring Road, Patna",
    rating: 5,
    comment: "Booked Full Body Checkup for my elderly parents. The digital pass generator is so fast. Polite technician and sterile kit used.",
    date: "1 week ago",
    verified: true,
  },
  {
    id: "rev-3",
    name: "Md. Rizwan",
    location: "Patna City",
    rating: 5,
    comment: "Needed urgent Dengue report for my son. Saba came within 45 minutes of WhatsApp booking. Very reliable doorstep service in Patna.",
    date: "2 weeks ago",
    verified: true,
  },
];

export function getPriceForTest(testName: string): { price: number; original: number } {
  if (!testName) return { price: 320, original: 400 };
  const found = TEST_PACKAGES.find(t => t.name.toLowerCase() === testName.toLowerCase() || testName.toLowerCase().includes(t.name.toLowerCase()));
  if (found) return { price: found.price, original: found.originalPrice };
  if (testName.includes('CBC') || testName.includes('Blood Count')) return { price: 320, original: 400 };
  if (testName.includes('Thyroid')) return { price: 480, original: 600 };
  if (testName.includes('Liver') || testName.includes('LFT')) return { price: 480, original: 600 };
  if (testName.includes('Kidney') || testName.includes('KFT')) return { price: 680, original: 850 };
  if (testName.includes('Lipid')) return { price: 320, original: 400 };
  if (testName.includes('Dengue')) return { price: 800, original: 1000 };
  if (testName.includes('Full') || testName.includes('Health') || testName.includes('Checkup')) return { price: 2000, original: 2500 };
  return { price: 320, original: 400 };
}
