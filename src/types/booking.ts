export interface TestPackage {
  id: string;
  name: string;
  category?: string;
  description: string;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  icon: string;
  badge?: string;
  featured?: boolean;
}

export interface BookingFormData {
  fullName: string;
  mobile: string;
  testType: string;
  prefDate: string;
  timeSlot: string;
  address: string;
}

export interface BookingPassData {
  refCode: string;
  name: string;
  initials: string;
  mobile: string;
  test: string;
  date: string;
  slot: string;
  address: string;
  price: number;
  originalPrice: number;
}

export interface ReviewItem {
  id: string;
  name: string;
  location: string;
  rating: number;
  comment: string;
  date: string;
  verified?: boolean;
}

export interface ConnectedHospital {
  id: string;
  name: string;
  location: string; // e.g., "Bailey Road, Patna" or "Kankarbagh, Patna"
  type: string; // e.g., "Super Specialty", "Multi-Specialty", "Apex Institute"
  specialities: string[]; // e.g., ["Cardiology", "Neurology", "Orthopedics"]
  doctorNetworkCount?: number; // e.g., 25+ Specialists
  badge?: string; // e.g., "NABH Accredited" or "Top Partner"
  isFeatured?: boolean;
}

export interface PartnerLab {
  id: string;
  name: string;
  accreditation: string; // e.g., "NABL & CAP Certified"
  category: string; // e.g., "National Reference Lab", "Patna Super-Diagnostic"
  description: string;
  turnaroundTime: string; // e.g., "6 - 12 Hours"
  badge?: string; // e.g., "Most Preferred"
  isFeatured?: boolean;
}

