import mongoose from "mongoose";

const PlotSchema = new mongoose.Schema(
  {
    plotNumber: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    size: {
      type: Number,
      required: true,
      min: 1,
    },

    unit: {
      type: String,
      enum: ["sqft", "sqyd"],
      default: "sqft",
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    facing: {
      type: String,
      enum: [
        "North",
        "South",
        "East",
        "West",
        "North-East",
        "North-West",
        "South-East",
        "South-West",
      ],
      required: true,
    },

    status: {
      type: String,
      enum: ["available", "hold", "sold"],
      default: "available",
    },

    mapPosition: {
      row: {
        type: Number,
        default: 1,
      },

      column: {
        type: Number,
        default: 1,
      },
    },
  },
  {
    timestamps: true,
  }
);

PlotSchema.index(
  {
    project: 1,
    plotNumber: 1,
  },
  {
    unique: true,
  }
);

const Plot = mongoose.models.Plot || mongoose.model("Plot", PlotSchema);

export default Plot;
