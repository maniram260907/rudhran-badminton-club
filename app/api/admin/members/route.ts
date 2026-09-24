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

async function verifyAdminSession() {
  const cookieStore = await cookies();
  const adminSession = cookieStore.get("admin_session")?.value;

  if (!adminSession) {
    return {
      valid: false,
      message: "Admin authentication required.",
    };
  }

  const adminId = Number(adminSession);

  if (!adminId) {
    return {
      valid: false,
      message: "Invalid admin session.",
    };
  }

  const admins = await db.orm.public.Admin
    .where({ id: adminId })
    .all();

  const admin = admins[0];

  if (!admin) {
    return {
      valid: false,
      message: "Invalid admin session.",
    };
  }

  return {
    valid: true,
    admin,
  };
}

export async function GET() {
  try {
    const adminCheck = await verifyAdminSession();

    if (!adminCheck.valid) {
      return NextResponse.json(
        {
          success: false,
          message: adminCheck.message,
        },
        { status: 401 }
      );
    }

    const members = await db.orm.public.Member.all();

    const safeMembers = members.map((member) =>
      removePasswordHash(
        member as unknown as Record<string, unknown>
      )
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
    const adminCheck = await verifyAdminSession();

    if (!adminCheck.valid) {
      return NextResponse.json(
        {
          success: false,
          message: adminCheck.message,
        },
        { status: 401 }
      );
    }

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

    if (member.paymentStatus === "PAID") {
      return NextResponse.json(
        {
          success: false,
          message: "Payment is already verified.",
        },
        { status: 400 }
      );
    }

    if (!member.paymentSubmitted) {
      return NextResponse.json(
        {
          success: false,
          message: "Payment has not been submitted by this member.",
        },
        { status: 400 }
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

    const safeMember = removePasswordHash(
      updatedMember as unknown as Record<string, unknown>
    );

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