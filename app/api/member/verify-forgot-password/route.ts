import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createHash, createHmac, timingSafeEqual } from "crypto";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const memberId = String(body.memberId || "").trim();
    const verificationCode = String(body.verificationCode || "").trim();

    if (!memberId || !verificationCode) {
      return NextResponse.json(
        {
          success: false,
          message: "Member ID and verification code are required.",
        },
        { status: 400 }
      );
    }

    if (!/^\d{6}$/.test(verificationCode)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid 6-digit verification code.",
        },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const resetOtp = cookieStore.get("reset_otp")?.value;

    if (!resetOtp) {
      return NextResponse.json(
        {
          success: false,
          message: "Verification code expired. Please request a new code.",
        },
        { status: 400 }
      );
    }

    const parts = resetOtp.split(".");

    if (parts.length !== 4) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid verification request.",
        },
        { status: 400 }
      );
    }

    const [storedMemberId, otpHash, expiresAt, signature] = parts;

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

    if (storedMemberId !== memberId) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid verification request.",
        },
        { status: 400 }
      );
    }

    if (Date.now() > Number(expiresAt)) {
      cookieStore.delete("reset_otp");

      return NextResponse.json(
        {
          success: false,
          message: "Verification code expired. Please request a new code.",
        },
        { status: 400 }
      );
    }

    const payload = `${storedMemberId}.${otpHash}.${expiresAt}`;

    const expectedSignature = createHmac("sha256", secret)
      .update(payload)
      .digest("hex");

    const providedSignature = Buffer.from(signature, "hex");
    const calculatedSignature = Buffer.from(expectedSignature, "hex");

    if (
      providedSignature.length !== calculatedSignature.length ||
      !timingSafeEqual(providedSignature, calculatedSignature)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid verification request.",
        },
        { status: 400 }
      );
    }

    const enteredOtpHash = createHash("sha256")
      .update(verificationCode)
      .digest("hex");

    const enteredHashBuffer = Buffer.from(enteredOtpHash, "hex");
    const storedHashBuffer = Buffer.from(otpHash, "hex");

    if (
      enteredHashBuffer.length !== storedHashBuffer.length ||
      !timingSafeEqual(enteredHashBuffer, storedHashBuffer)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid verification code.",
        },
        { status: 400 }
      );
    }

    const resetToken = createHmac("sha256", secret)
      .update(`${memberId}.${expiresAt}`)
      .digest("hex");

    cookieStore.set("password_reset_verified", `${memberId}.${expiresAt}.${resetToken}`, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 10 * 60,
    });

    cookieStore.delete("reset_otp");

    return NextResponse.json({
      success: true,
      message: "Verification successful.",
      memberId,
    });
  } catch (error) {
    console.error("OTP verification failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to verify the code. Please try again.",
      },
      { status: 500 }
    );
  }
}