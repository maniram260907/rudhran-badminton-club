import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { db } from "@/prisma/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      fullName,
      mobileNumber,
      password,
    } = body;

    // Authorization check
    let isAuthorized = false;

    // 1. Check if caller has an active admin session
    const cookieStore = await cookies();
    const adminSession = cookieStore.get("admin_session")?.value;
    if (adminSession) {
      const adminId = Number(adminSession);
      if (Number.isInteger(adminId) && adminId > 0) {
        const callerAdmin = await db.orm.public.Admin.first({ id: adminId });
        if (callerAdmin) {
          isAuthorized = true;
        }
      }
    }

    // 2. Check for setup secret in headers or request body
    const setupSecretHeader = request.headers.get("x-admin-secret");
    const setupSecretBody = typeof body.setupSecret === "string" ? body.setupSecret : "";
    const providedSecret = setupSecretHeader || setupSecretBody;

    if (!isAuthorized && process.env.ADMIN_SETUP_SECRET && providedSecret) {
      if (providedSecret === process.env.ADMIN_SETUP_SECRET) {
        isAuthorized = true;
      }
    }

    // 3. Initial setup fallback: If NO admin exists in the database yet, allow creating the first admin
    if (!isAuthorized) {
      const existingAdmins = await db.orm.public.Admin.all();
      if (existingAdmins.length === 0) {
        isAuthorized = true;
      }
    }

    if (!isAuthorized) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized: Admin authorization or setup secret required.",
        },
        { status: 401 }
      );
    }

    if (!fullName || !mobileNumber || !password) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please provide full name, mobile number, and password.",
        },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        {
          success: false,
          message: "Password must be at least 6 characters.",
        },
        { status: 400 }
      );
    }

    const existingAdmin = await db.orm.public.Admin.first({
      mobileNumber,
    });

    if (existingAdmin) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Admin with this mobile number already exists.",
        },
        { status: 409 }
      );
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 12);

    const now = new Date().toISOString();

    const admin = await db.orm.public.Admin.create({
      fullName,
      mobileNumber,
      passwordHash: hashedPassword,
      createdAt: now,
      updatedAt: now,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Admin created successfully.",
        admin: {
          id: admin.id,
          fullName: admin.fullName,
          mobileNumber: admin.mobileNumber,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create admin error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Something went wrong while creating admin.",
      },
      { status: 500 }
    );
  }
}