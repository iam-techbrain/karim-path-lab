import { neon } from "@neondatabase/serverless";

const databaseUrl =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  "postgresql://neondb_owner:npg_yJc5kr2HMbBo@ep-wandering-unit-awtf9k1w-pooler.c-12.us-east-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require";

export const sql = neon(databaseUrl);

let isDbInitialized = false;

/**
 * Automatically creates the tables if they don't already exist.
 */
export async function initDatabase() {
  if (isDbInitialized) return;

  try {
    // 1. Create bookings table
    await sql`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        ref_code VARCHAR(50) UNIQUE NOT NULL,
        patient_name VARCHAR(255) NOT NULL,
        mobile VARCHAR(20) NOT NULL,
        test_type VARCHAR(255) NOT NULL,
        pref_date VARCHAR(50) NOT NULL,
        time_slot VARCHAR(100) NOT NULL,
        address TEXT NOT NULL,
        price INT NOT NULL,
        original_price INT NOT NULL,
        discount_amount INT NOT NULL,
        status VARCHAR(50) DEFAULT 'CONFIRMED',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 2. Create reviews table
    await sql`
      CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        location VARCHAR(255),
        rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
        comment TEXT NOT NULL,
        verified BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 3. Seed initial reviews if reviews table is empty
    const countResult = await sql`SELECT count(*) FROM reviews;`;
    const count = parseInt(countResult[0]?.count || "0", 10);

    if (count === 0) {
      await sql`
        INSERT INTO reviews (name, location, rating, comment, verified)
        VALUES 
          ('Rajesh Verma', 'Kankarbagh, Patna', 5, 'Saba arrived right on time at 7 AM in Kankarbagh. Blood sample collection was completely painless and I got my CBC report on WhatsApp by evening!', true),
          ('Sneha Sharma', 'Boring Road, Patna', 5, 'Booked Full Body Checkup for my elderly parents. The digital pass generator is so fast. Polite technician and sterile kit used.', true),
          ('Md. Rizwan', 'Patna City', 5, 'Needed urgent Dengue report for my son. Saba came within 45 minutes of WhatsApp booking. Very reliable doorstep service in Patna.', true);
      `;
    }

    isDbInitialized = true;
  } catch (error) {
    console.error("Neon DB Init Error:", error);
    throw error;
  }
}
