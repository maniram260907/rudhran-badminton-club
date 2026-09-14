import { NextResponse } from "next/server";
import { db } from "@/prisma/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { mobileNumber, password } = body;

    if (!mobileNumber || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter mobile number and password.",
        },
        { status: 400 }
      );
    }

    const admin = await db.orm.public.Admin.first({
      mobileNumber,
    });

    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid mobile number or password.",
        },
        { status: 401 }
      );
    }

    if (admin.passwordHash !== password) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid mobile number or password.",
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Admin login successful.",
        admin: {
          id: admin.id,
          fullName: admin.fullName,
          mobileNumber: admin.mobileNumber,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Admin login error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong during admin login.",
      },
      { status: 500 }
    );
  }
}