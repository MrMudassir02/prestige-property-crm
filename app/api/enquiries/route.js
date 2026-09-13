import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";

import Enquiry from "@/models/Enquiry";
import Customer from "@/models/Customer";
import Plot from "@/models/Plot";
import Project from "@/models/Project";
import City from "@/models/City";

import { verifyToken, isAdmin } from "@/lib/auth";

export async function GET(request) {
  try {
    await connectDB();

    // GET TOKEN FROM COOKIE
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

    // CHECK ADMIN ROLE
    if (!isAdmin(result.user)) {
      return NextResponse.json(
        {
          success: false,
          message: "Access denied. Admin only",
        },
        {
          status: 403,
        }
      );
    }

    // FETCH ALL ENQUIRIES
    const enquiries = await Enquiry.find()
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
    console.error("Get enquiries error:", error);

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

export async function POST(request) {
  try {
    await connectDB();

    // Require a logged-in user (your Enquiry schema requires `user`)
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Please login" },
        { status: 401 }
      );
    }

    const result = verifyToken(token);
    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 401 }
      );
    }

    const { plotId, name, phone, email, message } = await request.json();

    if (!plotId || !name || !phone) {
      return NextResponse.json(
        { success: false, message: "Plot, name and phone are required" },
        { status: 400 }
      );
    }

    const plot = await Plot.findById(plotId);
    if (!plot) {
      return NextResponse.json(
        { success: false, message: "Plot not found" },
        { status: 404 }
      );
    }

    // Reuse an existing customer record (matched by phone) or create one
    let customer = await Customer.findOne({ phone });
    if (!customer) {
      customer = await Customer.create({ name, phone, email });
    } else {
      customer.name = name;
      if (email) customer.email = email;
      await customer.save();
    }

    const enquiry = await Enquiry.create({
      user: result.user.userId,
      customer: customer._id,
      plot: plotId,
      message,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Enquiry submitted successfully",
        data: enquiry,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create enquiry error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to submit enquiry" },
      { status: 500 }
    );
  }
}
