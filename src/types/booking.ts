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
