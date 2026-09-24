import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";
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

    const memberId = String(body.memberId || "").trim();
    const newPassword = String(body.newPassword || "");

    if (!memberId || !newPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Member ID and new password are required.",
        },
        { status: 400 }
      );
    }

    if (!/^\d+$/.test(memberId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid member ID.",
        },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        {
          success: false,
          message: "Password must be at least 6 characters.",
        },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();

    const verifiedCookie = cookieStore.get(
      "password_reset_verified"
    )?.value;

    if (!verifiedCookie) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Password reset verification required. Please verify the OTP first.",
        },
        { status: 403 }
      );
    }

    const parts = verifiedCookie.split(".");

    if (parts.length !== 3) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid password reset request.",
        },
        { status: 403 }
      );
    }

    const [verifiedMemberId, expiresAt, token] = parts;

    if (verifiedMemberId !== memberId) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid password reset request.",
        },
        { status: 403 }
      );
    }

    if (Date.now() > Number(expiresAt)) {
      cookieStore.delete("password_reset_verified");

      return NextResponse.json(
        {
          success: false,
          message:
            "Password reset session expired. Please request a new OTP.",
        },
        { status: 403 }
      );
    }

    const secret = process.env.RESEND_API_KEY;

    if (!secret) {
      console.error("RESEND_API_KEY is not configured.");

      return NextResponse.json(
        {
          success: false,
          message: "Server configuration error.",
        },
        { status: 500 }
      );
    }

    const expectedToken = createHmac("sha256", secret)
      .update(`${memberId}.${expiresAt}`)
      .digest("hex");

    const providedToken = Buffer.from(token, "hex");
    const calculatedToken = Buffer.from(expectedToken, "hex");

    if (
      providedToken.length !== calculatedToken.length ||
      !timingSafeEqual(providedToken, calculatedToken)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid password reset request.",
        },
        { status: 403 }
      );
    }

    const numericMemberId = Number(memberId);

    const members = await db.orm.public.Member
      .where({ id: numericMemberId })
      .all();

    const member = members[0];

    if (!member) {
      return NextResponse.json(
        {
          success: false,
          message: "Member not found.",
        },
        { status: 404 }
      );
    }

    // Hash the new password before storing it
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await db.orm.public.Member
      .where({ id: numericMemberId })
      .update({
        passwordHash: hashedPassword,
        updatedAt: new Date().toISOString(),
      });

    cookieStore.delete("password_reset_verified");

    return NextResponse.json({
      success: true,
      message: "Password reset successfully.",
    });
  } catch (error) {
    console.error("Password reset failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to reset password. Please try again.",
      },
      { status: 500 }
    );
  }
}