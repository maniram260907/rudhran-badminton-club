import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import postgres from "@prisma/orm-postgres/runtime";
import type { Contract } from "../../../../prisma/schema.d";
import contractJson from "../../../../prisma/schema.json" with { type: "json" };

const db = postgres<Contract>({
  contractJson,
  url: process.env.DATABASE_URL,
});

export async function PATCH(request: Request) {
  try {
    const cookieStore = await cookies();
    const memberSession = cookieStore.get("member_session")?.value;

    if (!memberSession) {
      return NextResponse.json(
        {
          success: false,
          message: "Member authentication required.",
        },
        { status: 401 }
      );
    }

    const memberId = Number(memberSession);

    if (!memberId) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid member session.",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    const paymentReference = String(
      body.paymentReference || ""
    ).trim();

    if (!paymentReference) {
      return NextResponse.json(
        {
          success: false,
          message: "Payment reference is required.",
        },
        { status: 400 }
      );
    }

    const members = await db.orm.public.Member
      .where({ id: memberId })
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

    if (member.paymentStatus === "PAID") {
      return NextResponse.json(
        {
          success: false,
          message: "Payment has already been verified.",
        },
        { status: 400 }
      );
    }

    const updatedMember = await db.orm.public.Member
      .where({ id: memberId })
      .update({
        paymentReference,
        paymentSubmitted: true,
      });

    if (!updatedMember) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to update payment details.",
        },
        { status: 500 }
      );
    }

    const safeMember = Object.fromEntries(
      Object.entries(updatedMember).filter(
        ([key]) => key !== "passwordHash"
      )
    );

    return NextResponse.json({
      success: true,
      message: "Payment submitted successfully.",
      member: safeMember,
    });
  } catch (error) {
    console.error("Payment submission failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to submit payment. Please try again.",
      },
      { status: 500 }
    );
  }
}