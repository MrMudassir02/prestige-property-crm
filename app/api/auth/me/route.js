import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function GET(request) {
  try {
    // GET TOKEN FROM COOKIE
    const token = request.cookies.get("token")?.value;

    // CHECK TOKEN
    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Not authenticated",
        },
        {
          status: 401,
        }
      );
    }

    // VERIFY TOKEN
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

    // RETURN LOGGED-IN USER
    return NextResponse.json(
      {
        success: true,
        user: {
          id: result.user.userId,
          email: result.user.email,
          role: result.user.role,
        },
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Get current user error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}
