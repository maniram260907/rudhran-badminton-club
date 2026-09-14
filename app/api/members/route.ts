import { NextResponse } from "next/server";
import postgres from "@prisma/orm-postgres/runtime";
import type { Contract } from "../../../prisma/schema.d";
import contractJson from "../../../prisma/schema.json" with { type: "json" };

const db = postgres<Contract>({
  contractJson,
  url: process.env.DATABASE_URL,
});

export async function GET() {
  try {
    const members = await db.orm.public.Member.all();

    const safeMembers = members.map(
      ({ passwordHash, ...member }) => member
    );

    return NextResponse.json({
      success: true,
      members: safeMembers,
    });
  } catch (error) {
    console.error("Failed to fetch members:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch members.",
      },
      { status: 500 }
    );
  }
}

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

    const updatedMember = await db.orm.public.Member
      .where({ id: memberId })
      .update({
        paymentSubmitted: true,
      });

    if (!updatedMember) {
      return NextResponse.json(
        {
          success: false,
          message: "Member not found.",
        },
        { status: 404 }
      );
    }

    const { passwordHash, ...safeMember } = updatedMember;

    return NextResponse.json({
      success: true,
      member: safeMember,
    });
  } catch (error) {
    console.error("Failed to update payment:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update payment.",
      },
      { status: 500 }
    );
  }
}