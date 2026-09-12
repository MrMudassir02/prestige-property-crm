import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import City from "@/models/City";

// GET ALL CITIES
export async function GET() {
  try {
    await connectDB();

    const cities = await City.find().sort({
      createdAt: -1,
    });

    return NextResponse.json({
      success: true,
      cities,
    });
  } catch (error) {
    console.error("Get cities error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch cities",
      },
      {
        status: 500,
      }
    );
  }
}

// CREATE CITY
export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();

    const { name, slug, state } = body;

    if (!name || !slug) {
      return NextResponse.json(
        {
          success: false,
          message: "Name and slug are required",
        },
        {
          status: 400,
        }
      );
    }

    const city = await City.create({
      name,
      slug,
      state,
    });

    return NextResponse.json(
      {
        success: true,
        message: "City created successfully",
        city,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Create city error:", error);

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
