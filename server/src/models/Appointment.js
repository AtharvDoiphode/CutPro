import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
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

    services: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
        required: true,
      },
    ],

    appointmentDate: {
      type: Date,
      required: true,
    },

    startTime: {
      type: String,
      required: true,
    },

    endTime: {
      type: String,
      required: true,
    },

    totalDuration: {
      type: Number,
      required: true,
    },

    totalPrice: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "completed",
        "cancelled",
      ],
      default: "pending",
    },

    /* -------------------------------------------------------------------------- */
    /*                                Payments                                    */
    /* -------------------------------------------------------------------------- */

    paymentMethod: {
      type: String,
      enum: ["cash", "online"],
      default: "cash",
    },

    paymentStatus: {
      type: String,
      enum: [
        "pending",
        "paid",
        "failed",
        "refunded",
      ],
      default: "pending",
    },

    razorpayOrderId: {
      type: String,
      default: "",
    },

    razorpayPaymentId: {
      type: String,
      default: "",
    },

    razorpaySignature: {
      type: String,
      default: "",
    },
    invoiceNumber: {
  type: String,
  default: "",
},

invoiceGeneratedAt: {
  type: Date,
  default: null,
},

    /* -------------------------------------------------------------------------- */

    notes: {
      type: String,
      default: "",
    },

    cancellationReason: {
      type: String,
      default: "",
    },
  },
  
  {
    timestamps: true,
  }
);

const Appointment = mongoose.model(
  "Appointment",
  appointmentSchema
);

export default Appointment;