import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

import Enquiry from "@/models/Enquiry";
import Customer from "@/models/Customer";
import Plot from "@/models/Plot";
import Project from "@/models/Project";
import City from "@/models/City";

export async function PATCH(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    const body = await request.json();
    const { status } = body;

    // VALIDATION
    const allowedStatuses = ["new", "contacted", "closed"];

    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid status",
        },
        {
          status: 400,
        }
      );
    }

    // UPDATE ENQUIRY
    const enquiry = await Enquiry.findByIdAndUpdate(
      id,
      {
        status,
      },
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("customer")
      .populate({
        path: "plot",
        populate: {
          path: "project",
          populate: {
            path: "city",
          },
        },
      });

    if (!enquiry) {
      return NextResponse.json(
        {
          success: false,
          message: "Enquiry not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Enquiry status updated successfully",
      data: enquiry,
    });
  } catch (error) {
    console.error("Update enquiry error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to update enquiry",
      },
      {
        status: 500,
      }
    );
  }
}
