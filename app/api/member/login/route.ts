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

    const mobileNumber = String(body.mobileNumber || "").trim();
    const password = String(body.password || "");

    if (!mobileNumber || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Mobile number and password are required.",
        },
        { status: 400 }
      );
    }

    const members = await db.orm.public.Member
      .where({ mobileNumber })
      .all();

    const member = members[0];

    if (!member) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid mobile number or password.",
        },
        { status: 401 }
      );
    }

    if (member.passwordHash !== password) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid mobile number or password.",
        },
        { status: 401 }
      );
    }

    const { passwordHash, ...safeMember } = member;
void passwordHash;

    return NextResponse.json({
      success: true,
      message: "Login successful.",
      member: safeMember,
    });
  } catch (error) {
    console.error("Member login failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to login. Please try again.",
      },
      { status: 500 }
    );
  }
}
