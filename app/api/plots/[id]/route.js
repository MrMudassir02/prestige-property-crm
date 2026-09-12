import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Plot from "@/models/Plot";

export async function GET(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    const plot = await Plot.findById(id).populate({
      path: "project",
      populate: {
        path: "city",
      },
    });

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

    return NextResponse.json({
      success: true,
      data: plot,
    });
  } catch (error) {
    console.error("Get property error:", error);

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
