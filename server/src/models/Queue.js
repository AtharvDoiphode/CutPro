import mongoose from "mongoose";

const queueSchema = new mongoose.Schema(
  {
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
      unique: true,
    },

    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    barber: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    queueNumber: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "waiting",
        "serving",
        "completed",
        "cancelled",
      ],
      default: "waiting",
    },

    checkedInAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Queue = mongoose.model("Queue", queueSchema);

export default Queue;