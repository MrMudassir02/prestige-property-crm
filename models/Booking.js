import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },

    plot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plot",
      required: true,
    },

    bookingStatus: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },

    bookedPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    document: {
      filename: {
        type: String,
        required: true,
      },

      path: {
        type: String,
        required: true,
      },

      mimetype: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Booking ||
  mongoose.model("Booking", BookingSchema);
