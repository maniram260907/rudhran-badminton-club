import { NextResponse } from "next/server";
import { db } from "@/prisma/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      fullName,
      mobileNumber,
      email,
      batch,
      feeAmount,
      password,
    } = body;

    // Check required fields
    if (
      !fullName ||
      !mobileNumber ||
      !batch ||
      !feeAmount ||
      !password
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Please fill in all required fields.",
        },
        { status: 400 }
      );
    }

    // Convert fee amount to a number
    const amount = Number(feeAmount);

    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid fee amount.",
        },
        { status: 400 }
      );
    }

    // Check whether mobile number already exists
    const existingMember = await db.orm.public.Member.first({
      mobileNumber,
    });

    if (existingMember) {
      return NextResponse.json(
        {
          success: false,
          message: "Mobile number is already registered.",
        },
        { status: 409 }
      );
    }

    // Create new member
    const now = new Date().toISOString();

    const member = await db.orm.public.Member.create({
      fullName,
      mobileNumber,
      email: email || null,
      batch,
      feeAmount: amount,
      passwordHash: password,
      paymentStatus: "PENDING",
      isActive: false,
      createdAt: now,
      updatedAt: now,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Registration successful.",
        memberId: member.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong during registration.",
      },
      { status: 500 }
    );
  }
}