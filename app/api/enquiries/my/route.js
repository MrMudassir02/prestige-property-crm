import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/auth";

import Enquiry from "@/models/Enquiry";
import Customer from "@/models/Customer";

export async function GET(request) {
  try {
    await connectDB();

    // Get JWT token
    const token = request.cookies.get("token")?.value;

    if (!token) {   
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized. Please login.",
        },
        {
          status: 401,
        }
      );
    }

    // Verify token
    const result = verifyToken(token);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired token.",
        },
        {
          status: 401,
        }
      );
    }

    const userEmail = result.user.email;

    // Find customer records belonging to logged-in user
    const customers = await Customer.find({
      email: userEmail,
    }).select("_id");

    const customerIds = customers.map((customer) => customer._id);

    // Get only this user's enquiries
    const enquiries = await Enquiry.find({
      customer: {
        $in: customerIds,
      },
    })
      .populate("customer")
      .populate({
        path: "plot",
        populate: {
          path: "project",
          populate: {
            path: "city",
          },
        },
      })
      .sort({
        createdAt: -1,
      });

    return NextResponse.json(
      {
        success: true,
        data: enquiries,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Get user enquiries error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch enquiries.",
      },
      {
        status: 500,
      }
    );
  }
}
