import { NextResponse } from "next/server";
import postgres from "@prisma/orm-postgres/runtime";
import type { Contract } from "../../../../prisma/schema.d";
import contractJson from "../../../../prisma/schema.json" with { type: "json" };

const db = postgres<Contract>({
  contractJson,
  url: process.env.DATABASE_URL,
});

export async function GET() {
  try {
    const members = await db.orm.public.Member
      .where({ isActive: true })
      .all();

    const publicMembers = members.map((member) => ({
      id: member.id,
      fullName: member.fullName,
      batch: member.batch,
    }));

    return NextResponse.json({
      success: true,
      members: publicMembers,
    });
  } catch (error) {
    console.error("Failed to load public batch members:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to load batch members.",
      },
      { status: 500 }
    );
  }
}