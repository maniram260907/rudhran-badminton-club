import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
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

    const hashedPassword = await bcrypt.hash(password, 12);

    const now = new Date().toISOString();

    const member = await db.orm.public.Member.create({
      fullName,
      mobileNumber,
      email: email || null,
      batch,
      feeAmount: amount,
      passwordHash: hashedPassword,

      paymentStatus: "PENDING",
      paymentSubmitted: false,
      paymentReference: null,

      isActive: false,

      createdAt: now,
      updatedAt: now,
    });

    const response = NextResponse.json(
      {
        success: true,
        message: "Registration successful.",
        memberId: member.id,
      },
      { status: 201 }
    );

    // Automatically log the newly registered member in
    response.cookies.set("member_session", String(member.id), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
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