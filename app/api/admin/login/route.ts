import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/prisma/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const mobileNumber = String(body.mobileNumber || "").trim();
    const password = String(body.password || "");

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

    let passwordValid = false;

    // Check bcrypt password first
    try {
      passwordValid = await bcrypt.compare(
        password,
        admin.passwordHash
      );
    } catch {
      passwordValid = false;
    }

    // Temporary migration support for admins
    // whose password is still stored as plain text.
    if (!passwordValid && admin.passwordHash === password) {
      const hashedPassword = await bcrypt.hash(password, 12);

      await db.orm.public.Admin
        .where({ id: admin.id })
        .update({
          passwordHash: hashedPassword,
        });

      passwordValid = true;
    }

    if (!passwordValid) {
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