import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";

export async function GET(request) {
  try {
    await connectDB();

    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized. Please login",
        },
        {
          status: 401,
        }
      );
    }

    const result = verifyToken(token);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: result.message,
        },
        {
          status: 401,
        }
      );
    }

    const user = await User.findById(result.user.userId).select("-password");

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: user,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Profile error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to fetch profile",
      },
      {
        status: 500,
      }
    );
  }
}
