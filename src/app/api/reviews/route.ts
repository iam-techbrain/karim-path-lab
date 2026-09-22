import { NextResponse } from "next/server";
import { INITIAL_REVIEWS } from "@/data/testsData";
import { ReviewItem } from "@/types/booking";

// In-memory reviews store
let reviewsStore: ReviewItem[] = [...INITIAL_REVIEWS];

export async function GET() {
  return NextResponse.json({ success: true, reviews: reviewsStore });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, location, rating, comment } = body;

    if (!name || !comment || !rating) {
      return NextResponse.json(
        { error: "Name, rating and feedback comment are required" },
        { status: 400 }
      );
    }

    const numRating = Math.max(1, Math.min(5, parseInt(rating, 10) || 5));

    const newRev: ReviewItem = {
      id: `rev-${Date.now()}`,
      name,
      location: location || "Patna, Bihar",
      rating: numRating,
      comment,
      verified: true,
      date: "Just now",
    };

    reviewsStore = [newRev, ...reviewsStore];

    return NextResponse.json({
      success: true,
      review: newRev,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to record review", details: error.message },
      { status: 500 }
    );
  }
}
