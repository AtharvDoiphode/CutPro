import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Service name is required"],
      trim: true,
      unique: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    price: {
      type: Number,
      required: [true, "Price is required"],
      min: 0,
    },

    duration: {
      type: Number,
      required: [true, "Duration is required"],
      min: 1,
    },

    category: {
      type: String,
      enum: [
        "Hair",
        "Beard",
        "Spa",
        "Facial",
        "Color",
        "Kids",
        "Other",
      ],
      default: "Other",
    },

    image: {
      type: String,
      default: "",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Service = mongoose.model("Service", serviceSchema);

export default Service;