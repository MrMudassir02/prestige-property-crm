import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

import Project from "@/models/Project";
import City from "@/models/City";

// GET ALL PROJECTS
export async function GET() {
  try {
    await connectDB();

    const projects = await Project.find().populate("city").sort({
      createdAt: -1,
    });

    return NextResponse.json({
      success: true,
      projects,
    });
  } catch (error) {
    console.error("Get projects error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch projects",
      },
      {
        status: 500,
      }
    );
  }
}

// CREATE PROJECT
export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();

    const { name, city, type, description } = body;

    if (!name || !city) {
      return NextResponse.json(
        {
          success: false,
          message: "Project name and city are required",
        },
        {
          status: 400,
        }
      );
    }

    // Check city exists

    const existingCity = await City.findById(city);

    if (!existingCity) {
      return NextResponse.json(
        {
          success: false,
          message: "Selected city does not exist",
        },
        {
          status: 404,
        }
      );
    }

    const project = await Project.create({
      name,

      city,

      type: type || "plots",

      description,
    });

    const populatedProject = await project.populate("city");

    return NextResponse.json(
      {
        success: true,
        message: "Project created successfully",
        project: populatedProject,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Create project error:", error);

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
    