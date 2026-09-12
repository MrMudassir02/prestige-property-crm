import { connectDB } from "@/lib/mongodb";

import City from "@/models/City";
import Project from "@/models/Project";
import Plot from "@/models/Plot";

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

    return Response.json({
      success: true,
      data: plots,
    });
  } catch (error) {
    console.error("Get plots error:", error);

    return Response.json(
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

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();

    const {
      cityName,
      state,
      projectName,
      plotNumber,
      size,
      unit,
      price,
      facing,
      status,
      row,
      column,
    } = body;

    if (
      !cityName ||
      !projectName ||
      !plotNumber ||
      !size ||
      !price ||
      !facing
    ) {
      return Response.json(
        {
          success: false,
          message: "Please provide all required fields",
        },
        {
          status: 400,
        }
      );
    }

    const slug = cityName.toLowerCase().trim().replace(/\s+/g, "-");

    let city = await City.findOne({ slug });

    if (!city) {
      city = await City.create({
        name: cityName,
        slug,
        state,
      });
    }

    let project = await Project.findOne({
      name: projectName,
      city: city._id,
    });

    if (!project) {
      project = await Project.create({
        name: projectName,
        city: city._id,
        type: "plots",
      });
    }

    const existingPlot = await Plot.findOne({
      plotNumber,
      project: project._id,
    });

    if (existingPlot) {
      return Response.json(
        {
          success: false,
          message: "Plot already exists in this project",
        },
        {
          status: 409,
        }
      );
    }

    const plot = await Plot.create({
      plotNumber,
      project: project._id,
      size: Number(size),
      unit: unit || "sqft",
      price: Number(price),
      facing,
      status: status || "available",
      mapPosition: {
        row: Number(row) || 1,
        column: Number(column) || 1,
      },
    });

    return Response.json(
      {
        success: true,
        message: "Plot created successfully",
        data: {
          city,
          project,
          plot,
        },
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Create plot error:", error);

    return Response.json(
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
