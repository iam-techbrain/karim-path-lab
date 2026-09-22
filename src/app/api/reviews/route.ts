import { NextResponse } from "next/server";
import { sql, initDatabase } from "@/lib/db";

export async function GET() {
  try {
    await initDatabase();
    const rows = await sql`
      SELECT 
        id::text,
        name,
        location,
        rating,
        comment,
        verified,
        to_char(created_at, 'DD Mon YYYY') as date
      FROM reviews
      ORDER BY created_at DESC
      LIMIT 30;
    `;
    return NextResponse.json({ success: true, reviews: rows });
  } catch (error: any) {
    console.error("Fetch Reviews Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews from database", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await initDatabase();
    const body = await request.json();
    const { name, location, rating, comment } = body;

    if (!name || !comment || !rating) {
      return NextResponse.json(
        { error: "Name, rating and feedback comment are required" },
        { status: 400 }
      );
    }

    const numRating = Math.max(1, Math.min(5, parseInt(rating, 10) || 5));

    const result = await sql`
      INSERT INTO reviews (name, location, rating, comment, verified)
      VALUES (
        ${name},
        ${location || 'Patna, Bihar'},
        ${numRating},
        ${comment},
        true
      )
      RETURNING 
        id::text,
        name,
        location,
        rating,
        comment,
        verified,
        to_char(created_at, 'DD Mon YYYY') as date;
    `;

    return NextResponse.json({
      success: true,
      review: result[0],
    });
  } catch (error: any) {
    console.error("Save Review Error:", error);
    return NextResponse.json(
      { error: "Failed to save review in database", details: error.message },
      { status: 500 }
    );
  }
}
