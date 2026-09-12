import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    city: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "City",
      required: true,
    },

    type: {
      type: String,
      enum: ["plots", "villas", "apartments", "mixed"],
      default: "plots",
    },

    description: {
      type: String,
      trim: true,
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

ProjectSchema.index(
  {
    city: 1,
    name: 1,
  },
  {
    unique: true,
  }
);

export default mongoose.models.Project ||
  mongoose.model("Project", ProjectSchema);
