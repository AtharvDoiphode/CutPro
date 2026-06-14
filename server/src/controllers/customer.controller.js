import User from "../models/User.js";
import Appointment from "../models/Appointment.js";

import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

/* -------------------------------------------------------------------------- */
/*                          Customer Dashboard                                */
/* -------------------------------------------------------------------------- */

export const getDashboard = asyncHandler(async (req, res) => {
  // Get logged-in customer
  const customer = await User.findById(req.user._id).select(
  `
  name
  email
  phone
  avatar
  role
  isVerified
  createdAt
  updatedAt
  `
);

  if (!customer) {
    throw new ApiError(404, "Customer not found");
  }

  // Statistics
  const totalAppointments = await Appointment.countDocuments({
    customer: req.user._id,
  });

  const completedAppointments = await Appointment.countDocuments({
    customer: req.user._id,
    status: "completed",
  });

  const pendingAppointments = await Appointment.countDocuments({
    customer: req.user._id,
    status: "pending",
  });

  const cancelledAppointments = await Appointment.countDocuments({
    customer: req.user._id,
    status: "cancelled",
  });

  // Next upcoming appointment
  const now = new Date();

  const upcomingAppointment = await Appointment.findOne({
    customer: req.user._id,
    appointmentDate: { $gte: now },
    status: "pending",
  })
    .populate(
      "barber",
      "name avatar experience specialization rating"
    )
    .populate("services", "name price duration")
    .sort({
      appointmentDate: 1,
      startTime: 1,
    });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        profile: customer,
        stats: {
          totalAppointments,
          completedAppointments,
          pendingAppointments,
          cancelledAppointments,
        },
        upcomingAppointment,
      },
      "Customer dashboard fetched successfully"
    )
  );
});
/* -------------------------------------------------------------------------- */
/*                           Get Customer Profile                             */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                           Get Customer Profile                             */
/* -------------------------------------------------------------------------- */

export const getProfile = asyncHandler(async (req, res) => {
  const customer = await User.findById(req.user._id).select(
    `
    name
    email
    phone
    avatar
    role
    isVerified
    createdAt
    updatedAt
    `
  );

  if (!customer) {
    throw new ApiError(404, "Customer not found");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      customer,
      "Customer profile fetched successfully"
    )
  );
});
/* -------------------------------------------------------------------------- */
/*                         Update Customer Profile                            */
/* -------------------------------------------------------------------------- */

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, avatar } = req.body;

  const customer = await User.findById(req.user._id);

  if (!customer) {
    throw new ApiError(404, "Customer not found");
  }

  // Update only allowed fields
  if (name !== undefined) {
    customer.name = name;
  }

  if (phone !== undefined) {
    customer.phone = phone;
  }

  if (avatar !== undefined) {
    customer.avatar = avatar;
  }

  await customer.save();

  const updatedCustomer = await User.findById(
    customer._id
  ).select("-password -refreshToken");

  return res.status(200).json(
    new ApiResponse(
      200,
      updatedCustomer,
      "Profile updated successfully"
    )
  );
});
/* -------------------------------------------------------------------------- */
/*                    Get Upcoming Appointments                               */
/* -------------------------------------------------------------------------- */

export const getUpcomingAppointments = asyncHandler(
  async (req, res) => {
    const now = new Date();

    const appointments = await Appointment.find({
  customer: req.user._id,
  status: "pending",
})
  .populate(
    "barber",
    "name avatar experience specialization rating"
  )
  .populate("services")
  .sort({
    appointmentDate: 1,
    startTime: 1,
  });

    return res.status(200).json(
      new ApiResponse(
        200,
        appointments,
        "Upcoming appointments fetched successfully"
      )
    );
  }
);
/* -------------------------------------------------------------------------- */
/*                      Get Past Appointments                                 */
/* -------------------------------------------------------------------------- */

export const getPastAppointments = asyncHandler(
  async (req, res) => {
    const appointments = await Appointment.find({
      customer: req.user._id,
      status: "completed",
    })
      .populate(
        "barber",
        "name avatar experience specialization rating"
      )
      .populate("services")
      .sort({
        appointmentDate: -1,
        startTime: -1,
      });

    return res.status(200).json(
      new ApiResponse(
        200,
        appointments,
        "Past appointments fetched successfully"
      )
    );
  }
);
/* -------------------------------------------------------------------------- */
/*                   Get Cancelled Appointments                               */
/* -------------------------------------------------------------------------- */

export const getCancelledAppointments = asyncHandler(
  async (req, res) => {
    const appointments = await Appointment.find({
      customer: req.user._id,
      status: "cancelled",
    })
      .populate(
        "barber",
        "name avatar experience specialization rating"
      )
      .populate("services")
      .sort({
        appointmentDate: -1,
        startTime: -1,
      });

    return res.status(200).json(
      new ApiResponse(
        200,
        appointments,
        "Cancelled appointments fetched successfully"
      )
    );
  }
);