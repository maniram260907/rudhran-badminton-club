import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/prisma/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { adminId } = body;

    if (!adminId) {
      return NextResponse.json(
        {
          success: false,
          message: "Admin ID is required.",
        },
        { status: 400 }
      );
    }

    const admin = await db.orm.public.Admin.first({
      id: Number(adminId),
    });

    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          message: "Admin not found.",
        },
        { status: 404 }
      );
    }

    const response = NextResponse.json(
      {
        success: true,
        message: "Authentication successful.",
      },
      { status: 200 }
    );

    response.cookies.set("admin_session", String(admin.id), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch (error) {
    console.error("Admin authentication error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Authentication failed.",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const adminSession = cookieStore.get("admin_session");

    if (!adminSession?.value) {
      return NextResponse.json(
        {
          success: false,
          message: "Not authenticated.",
        },
        { status: 401 }
      );
    }

    const adminId = Number(adminSession.value);

    if (!Number.isInteger(adminId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid authentication session.",
        },
        { status: 401 }
      );
    }

    const admin = await db.orm.public.Admin.first({
      id: adminId,
    });

    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          message: "Admin account not found.",
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        admin: {
          id: admin.id,
          fullName: admin.fullName,
          mobileNumber: admin.mobileNumber,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Admin authentication check error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to verify authentication.",
      },
      { status: 500 }
    );
  }
}