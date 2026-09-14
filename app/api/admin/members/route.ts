import { NextResponse } from "next/server";
import postgres from "@prisma/orm-postgres/runtime";
import type { Contract } from "../../../../prisma/schema.d";
import contractJson from "../../../../prisma/schema.json" with { type: "json" };

const db = postgres<Contract>({
  contractJson,
  url: process.env.DATABASE_URL,
});

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const memberId = Number(body.memberId);

    if (!memberId) {
      return NextResponse.json(
        {
          success: false,
          message: "Member ID is required.",
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

    await db.orm.public.Member
      .where({ id: memberId })
      .update({
        paymentStatus: "PAID",
        isActive: true,
      });

    const updatedMembers = await db.orm.public.Member
      .where({ id: memberId })
      .all();

    const updatedMember = updatedMembers[0];

    if (!updatedMember) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to get updated member.",
        },
        { status: 500 }
      );
    }

    const { passwordHash, ...safeMember } = updatedMember;

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully.",
      member: safeMember,
    });
  } catch (error) {
    console.error("Failed to verify payment:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to verify payment.",
      },
      { status: 500 }
    );
  }
}