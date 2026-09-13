import mongoose from "mongoose";

const EnquirySchema = new mongoose.Schema(
  {
    // LOGGED-IN USER
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // CUSTOMER CONTACT DETAILS
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },

    // SELECTED PROPERTY
    plot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plot",
      required: true,
    },

    message: {
      type: String,
      trim: true,
      default: "",
    },

    status: {
      type: String,
      enum: ["new", "contacted", "closed"],
      default: "new",
    },
  },
  {
    timestamps: true,
  }
);

const Enquiry =
  mongoose.models.Enquiry || mongoose.model("Enquiry", EnquirySchema);

export default Enquiry;
