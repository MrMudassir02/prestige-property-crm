import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();

    const email = body.email?.toLowerCase().trim();
    const password = body.password;

    // VALIDATION

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and password are required",
        },
        {
          status: 400,
        }
      );
    }

    // PASSWORD VALIDATION

    if (password.length < 6) {
      return NextResponse.json(
        {
          success: false,
          message: "Password must be at least 6 characters",
        },
        {
          status: 400,
        }
      );
    }

    // CHECK EXISTING USER

    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "An account with this email already exists",
        },
        {
          status: 409,
        }
      );
    }

    // HASH PASSWORD

    const hashedPassword = await bcrypt.hash(password, 12);

    // CREATE USER

    const user = await User.create({
      email,
      password: hashedPassword,
      role: "user",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully",
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
        },
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Registration error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to create account",
      },
      {
        status: 500,
      }
    );
  }
}
