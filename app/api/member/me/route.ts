import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import postgres from "@prisma/orm-postgres/runtime";
import type { Contract } from "../../../../prisma/schema.d";
import contractJson from "../../../../prisma/schema.json" with { type: "json" };

const db = postgres<Contract>({
  contractJson,
  url: process.env.DATABASE_URL,
});

function removePasswordHash(member: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(member).filter(([key]) => key !== "passwordHash")
  );
}

export async function GET() {
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

    const safeMember = removePasswordHash(
      member as unknown as Record<string, unknown>
    );

    return NextResponse.json({
      success: true,
      member: safeMember,
    });
  } catch (error) {
    console.error("Failed to fetch member:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch member details.",
      },
      { status: 500 }
    );
  }
}