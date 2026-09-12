import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";

import Plot from "@/models/Plot";
import Project from "@/models/Project";
import City from "@/models/City";

export async function GET() {
  try {
    await connectDB();

    const plots = await Plot.find()
      .populate({
        path: "project",
        populate: {
          path: "city",
        },
      })
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      plots,
    });
  } catch (error) {
    console.error("Get plots error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to fetch plots",
      },
      {
        status: 500,
      }
    );
  }
}
