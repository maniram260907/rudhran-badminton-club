import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createHash, createHmac } from "crypto";
import { Resend } from "resend";
import postgres from "@prisma/orm-postgres/runtime";
import type { Contract } from "../../../../prisma/schema.d";
import contractJson from "../../../../prisma/schema.json" with { type: "json" };

const db = postgres<Contract>({
  contractJson,
  url: process.env.DATABASE_URL,
});

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const mobileNumber = String(body.mobileNumber || "").trim();

    if (!mobileNumber) {
      return NextResponse.json(
        {
          success: false,
          message: "Mobile number is required.",
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
          message: "No member found with this mobile number.",
        },
        { status: 404 }
      );
    }

    if (!member.email) {
      return NextResponse.json(
        {
          success: false,
          message:
            "No email address is registered for this member. Please contact the admin.",
        },
        { status: 400 }
      );
    }

    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not configured.");

      return NextResponse.json(
        {
          success: false,
          message: "Email service is not configured.",
        },
        { status: 500 }
      );
    }

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const otpHash = createHash("sha256")
      .update(verificationCode)
      .digest("hex");

    const expiresAt = Date.now() + 10 * 60 * 1000;

    const payload = `${member.id}.${otpHash}.${expiresAt}`;

    const signature = createHmac(
      "sha256",
      process.env.RESEND_API_KEY
    )
      .update(payload)
      .digest("hex");

    const cookieStore = await cookies();

    cookieStore.set(
      "reset_otp",
      `${member.id}.${otpHash}.${expiresAt}.${signature}`,
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 10 * 60,
      }
    );

    const { error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: member.email,
      subject: "Rudhran Badminton Club - Password Reset OTP",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto;">
          <h2>Rudhran Badminton Club</h2>

          <p>We received a request to reset your password.</p>

          <p>Your verification code is:</p>

          <div style="
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 8px;
            padding: 16px;
            background: #f1f5f9;
            text-align: center;
            border-radius: 12px;
          ">
            ${verificationCode}
          </div>

          <p>This code will expire in <strong>10 minutes</strong>.</p>

          <p>If you did not request a password reset, you can safely ignore this email.</p>

          <p>— Rudhran Badminton Club</p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend email failed:", error);

      cookieStore.delete("reset_otp");

      return NextResponse.json(
        {
          success: false,
          message: "Unable to send the verification email. Please try again.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Verification code sent to your registered email.",
      memberId: member.id,
    });
  } catch (error) {
    console.error("Forgot password failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to process password reset. Please try again.",
      },
      { status: 500 }
    );
  }
}