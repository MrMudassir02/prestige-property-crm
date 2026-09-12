import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

import Plot from "@/models/Plot";
import Booking from "@/models/Booking";
import Enquiry from "@/models/Enquiry";

export async function GET() {
  try {
    await connectDB();

    const [totalPlots, totalBookings, totalEnquiries, salesByCity] =
      await Promise.all([
        Plot.countDocuments(),

        Booking.countDocuments(),

        Enquiry.countDocuments(),

        Booking.aggregate([
          {
            $match: {
              bookingStatus: "confirmed",
            },
          },

          {
            $lookup: {
              from: "plots",
              localField: "plot",
              foreignField: "_id",
              as: "plotData",
            },
          },

          {
            $unwind: "$plotData",
          },

          {
            $lookup: {
              from: "projects",
              localField: "plotData.project",
              foreignField: "_id",
              as: "projectData",
            },
          },

          {
            $unwind: "$projectData",
          },

          {
            $lookup: {
              from: "cities",
              localField: "projectData.city",
              foreignField: "_id",
              as: "cityData",
            },
          },

          {
            $unwind: "$cityData",
          },

          {
            $group: {
              _id: "$cityData.name",

              totalSales: {
                $sum: "$bookedPrice",
              },

              totalBookings: {
                $sum: 1,
              },
            },
          },

          {
            $sort: {
              totalSales: -1,
            },
          },
        ]),
      ]);

    return NextResponse.json({
      success: true,

      data: {
        totalPlots,
        totalBookings,
        totalEnquiries,
        salesByCity,
      },
    });
  } catch (error) {
    console.error("Dashboard API error:", error);

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
