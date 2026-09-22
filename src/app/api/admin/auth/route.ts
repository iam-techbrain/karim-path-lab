import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    const expectedUser = "admin";
    const expectedPassword = process.env.ADMIN_PASSWORD || "admin@karim2024";

    if (
      username?.trim().toLowerCase() === expectedUser &&
      password?.trim() === expectedPassword
    ) {
      // Create response with auth cookie
      const response = NextResponse.json({
        success: true,
        message: "Authentication successful",
      });

      // Set cookie for 7 days
      response.cookies.set("kpl_admin_session", "authenticated_admin", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });

      return response;
    }

    return NextResponse.json(
      { error: "Invalid username or password" },
      { status: 401 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: "Authentication failed", details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  // Check auth session
  const cookieHeader = request.headers.get("cookie") || "";
  const isAuthenticated = cookieHeader.includes("kpl_admin_session=authenticated_admin");

  return NextResponse.json({
    authenticated: isAuthenticated,
  });
}

export async function DELETE() {
  // Logout
  const response = NextResponse.json({ success: true, message: "Logged out" });
  response.cookies.delete("kpl_admin_session");
  return response;
}
