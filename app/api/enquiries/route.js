import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Enquiry from "@/models/Enquiry";
import Customer from "@/models/Customer";
import Plot from "@/models/Plot";
import Project from "@/models/Project";
import City from "@/models/City";

// GET ALL ENQUIRIES
export async function GET() {
  try {
    await connectDB();

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
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: enquiries,
    });
  } catch (error) {
    console.error("Get enquiries error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 500,
      }
    );
  }
}

// CREATE ENQUIRY
export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();

    const { name, phone, email, message, plotId } = body;

    // VALIDATION
    if (!name || !phone || !plotId) {
      return NextResponse.json(
        {
          success: false,
          message: "Name, phone and plot are required",
        },
        {
          status: 400,
        }
      );
    }

    // CHECK PLOT
    const plot = await Plot.findById(plotId);

    if (!plot) {
      return NextResponse.json(
        {
          success: false,
          message: "Property not found",
        },
        {
          status: 404,
        }
      );
    }

    // FIND EXISTING CUSTOMER
    let customer = await Customer.findOne({
      phone,
    });

    // CREATE CUSTOMER IF NOT EXISTS
    if (!customer) {
      customer = await Customer.create({
        name,
        phone,
        email: email || "",
      });
    }

    // CREATE ENQUIRY
    const enquiry = await Enquiry.create({
      customer: customer._id,
      plot: plot._id,
      message: message || "",
    });

    // POPULATE DATA
    const populatedEnquiry = await Enquiry.findById(enquiry._id)
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

    return NextResponse.json(
      {
        success: true,
        message: "Enquiry submitted successfully",
        data: populatedEnquiry,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Create enquiry error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 500,
      }
    );
  }
}
