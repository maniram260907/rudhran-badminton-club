import { NextResponse } from "next/server";
import { db } from "@/prisma/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      fullName,
      mobileNumber,
      password,
    } = body;

    if (!fullName || !mobileNumber || !password) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please provide full name, mobile number, and password.",
        },
        { status: 400 }
      );
    }

    const existingAdmin = await db.orm.public.Admin.first({
      mobileNumber,
    });

    if (existingAdmin) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Admin with this mobile number already exists.",
        },
        { status: 409 }
      );
    }

    const now = new Date().toISOString();

    const admin = await db.orm.public.Admin.create({
      fullName,
      mobileNumber,
      passwordHash: password,
      createdAt: now,
      updatedAt: now,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Admin created successfully.",
        admin: {
          id: admin.id,
          fullName: admin.fullName,
          mobileNumber: admin.mobileNumber,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create admin error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Something went wrong while creating admin.",
      },
      { status: 500 }
    );
  }
}