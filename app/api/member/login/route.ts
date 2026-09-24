import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
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

    let passwordValid = false;

    // Check bcrypt password first
    try {
      passwordValid = await bcrypt.compare(
        password,
        member.passwordHash
      );
    } catch {
      passwordValid = false;
    }

    // Temporary migration support for members
    // whose password is still stored as plain text.
    if (!passwordValid && member.passwordHash === password) {
      const hashedPassword = await bcrypt.hash(password, 12);

      await db.orm.public.Member
        .where({ id: member.id })
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

    const safeMember = Object.fromEntries(
      Object.entries(member).filter(
        ([key]) => key !== "passwordHash"
      )
    );

    const response = NextResponse.json({
      success: true,
      message: "Login successful.",
      member: safeMember,
    });

    const cookieStore = await cookies();

    cookieStore.set("member_session", String(member.id), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
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