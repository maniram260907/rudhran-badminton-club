import { NextResponse } from "next/server";
import postgres from "@prisma/orm-postgres/runtime";
import type { Contract } from "../../../../prisma/schema.d";
import contractJson from "../../../../prisma/schema.json" with { type: "json" };

const db = postgres<Contract>({
  contractJson,
  url: process.env.DATABASE_URL,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { mobileNumber, password } = body;

    if (!mobileNumber || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Mobile number and password are required.",
        },
        { status: 400 }
      );
    }

    const members = await db.orm.public.Member.all();

    const member = members.find(
      (item) => item.mobileNumber === mobileNumber
    );

    if (!member) {
      return NextResponse.json(
        {
          success: false,
          message: "Member not found.",
        },
        { status: 401 }
      );
    }

    if (member.passwordHash !== password) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid password.",
        },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Login successful.",
      member: {
        id: member.id,
        fullName: member.fullName,
        mobileNumber: member.mobileNumber,
        email: member.email,
        batch: member.batch,
        feeAmount: member.feeAmount,
        paymentStatus: member.paymentStatus,
        isActive: member.isActive,
      },
    });
  } catch (error) {
    console.error("Member login error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while logging in.",
      },
      { status: 500 }
    );
  }
}