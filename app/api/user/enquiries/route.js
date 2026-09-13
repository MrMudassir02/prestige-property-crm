import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";

import Enquiry from "@/models/Enquiry";
import Customer from "@/models/Customer";
import Plot from "@/models/Plot";
import Project from "@/models/Project";
import City from "@/models/City";

import { verifyToken } from "@/lib/auth";

export async function GET(request) {
  try {
    await connectDB();

    // GET TOKEN
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

    // GET LOGGED-IN USER EMAIL
    const userEmail = result.user.email;

    // FIND CUSTOMER WITH SAME EMAIL
    const customer = await Customer.findOne({
      email: userEmail.toLowerCase(),
    });

    // IF CUSTOMER HAS NO ENQUIRIES
    if (!customer) {
      return NextResponse.json(
        {
          success: true,
          data: [],
        },
        {
          status: 200,
        }
      );
    }

    // FETCH ONLY THIS CUSTOMER'S ENQUIRIES
    const enquiries = await Enquiry.find({
      customer: customer._id,
    })
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
    console.error("User enquiries error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to fetch enquiries",
      },
      {
        status: 500,
      }
    );
  }
}
