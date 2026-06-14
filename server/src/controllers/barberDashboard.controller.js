import User from "../models/User.js";
import Appointment from "../models/Appointment.js";

import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

/* -------------------------------------------------------------------------- */
/*                           Barber Dashboard                                 */
/* -------------------------------------------------------------------------- */

export const getDashboard = asyncHandler(async (req, res) => {
  const barber = await User.findById(req.user._id).select(
    "-password -refreshToken"
  );

  if (!barber || barber.role !== "barber") {
    throw new ApiError(404, "Barber not found");
  }

  // Today's range
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const todayAppointments = await Appointment.countDocuments({
    barber: req.user._id,
    appointmentDate: {
      $gte: todayStart,
      $lte: todayEnd,
    },
    status: {
      $ne: "cancelled",
    },
  });

  const pendingAppointments = await Appointment.countDocuments({
    barber: req.user._id,
    status: "pending",
  });

  const completedAppointments = await Appointment.countDocuments({
    barber: req.user._id,
    status: "completed",
  });

  const revenueResult = await Appointment.aggregate([
    {
      $match: {
        barber: req.user._id,
        paymentStatus: "paid",
        appointmentDate: {
          $gte: todayStart,
          $lte: todayEnd,
        },
      },
    },
    {
      $group: {
        _id: null,
        revenue: {
          $sum: "$totalPrice",
        },
      },
    },
  ]);

  const todayRevenue = revenueResult[0]?.revenue || 0;

  const nextAppointment = await Appointment.findOne({
    barber: req.user._id,
    appointmentDate: {
      $gte: new Date(),
    },
    status: "pending",
  })
    .populate("customer", "name phone avatar")
    .populate("services")
    .sort({
      appointmentDate: 1,
      startTime: 1,
    });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        profile: barber,
        stats: {
          todayAppointments,
          pendingAppointments,
          completedAppointments,
          todayRevenue,
        },
        nextAppointment,
      },
      "Barber dashboard fetched successfully"
    )
  );
});

/* -------------------------------------------------------------------------- */
/*                           Get Barber Profile                               */
/* -------------------------------------------------------------------------- */

export const getProfile = asyncHandler(async (req, res) => {
  const barber = await User.findById(req.user._id).select(
    "-password -refreshToken"
  );

  if (!barber) {
    throw new ApiError(404, "Barber not found");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      barber,
      "Barber profile fetched successfully"
    )
  );
});

/* -------------------------------------------------------------------------- */
/*                         Update Barber Profile                              */
/* -------------------------------------------------------------------------- */

export const updateProfile = asyncHandler(async (req, res) => {
  const {
    name,
    phone,
    avatar,
    experience,
    specialization,
    workingDays,
    startTime,
    endTime,
    isAvailable,
  } = req.body;

  const barber = await User.findById(req.user._id);

  if (!barber) {
    throw new ApiError(404, "Barber not found");
  }

  if (name !== undefined) barber.name = name;
  if (phone !== undefined) barber.phone = phone;
  if (avatar !== undefined) barber.avatar = avatar;
  if (experience !== undefined) barber.experience = experience;
  if (specialization !== undefined)
    barber.specialization = specialization;
  if (workingDays !== undefined)
    barber.workingDays = workingDays;
  if (startTime !== undefined) barber.startTime = startTime;
  if (endTime !== undefined) barber.endTime = endTime;
  if (isAvailable !== undefined)
    barber.isAvailable = isAvailable;

  await barber.save();

  const updatedBarber = await User.findById(
    barber._id
  ).select("-password -refreshToken");

  return res.status(200).json(
    new ApiResponse(
      200,
      updatedBarber,
      "Barber profile updated successfully"
    )
  );
});
/* -------------------------------------------------------------------------- */
/*                      Get Today's Appointments                              */
/* -------------------------------------------------------------------------- */

export const getTodayAppointments = asyncHandler(async (req, res) => {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const appointments = await Appointment.find({
    barber: req.user._id,
    appointmentDate: {
      $gte: todayStart,
      $lte: todayEnd,
    },
    status: {
      $ne: "cancelled",
    },
  })
    .populate("customer", "name phone avatar")
    .populate("services")
    .sort({
      startTime: 1,
    });

  return res.status(200).json(
    new ApiResponse(
      200,
      appointments,
      "Today's appointments fetched successfully"
    )
  );
});
/* -------------------------------------------------------------------------- */
/*                    Get Upcoming Appointments                               */
/* -------------------------------------------------------------------------- */

export const getUpcomingAppointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find({
    barber: req.user._id,
    appointmentDate: {
      $gte: new Date(),
    },
    status: "pending",
  })
    .populate("customer", "name phone avatar")
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
});
/* -------------------------------------------------------------------------- */
/*                   Get Completed Appointments                               */
/* -------------------------------------------------------------------------- */

export const getCompletedAppointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find({
    barber: req.user._id,
    status: "completed",
  })
    .populate("customer", "name phone avatar")
    .populate("services")
    .sort({
      appointmentDate: -1,
      startTime: -1,
    });

  return res.status(200).json(
    new ApiResponse(
      200,
      appointments,
      "Completed appointments fetched successfully"
    )
  );
});
/* -------------------------------------------------------------------------- */
/*                           Barber Statistics                                */
/* -------------------------------------------------------------------------- */

export const getStats = asyncHandler(async (req, res) => {
  const totalAppointments = await Appointment.countDocuments({
    barber: req.user._id,
  });

  const completedAppointments = await Appointment.countDocuments({
    barber: req.user._id,
    status: "completed",
  });

  const pendingAppointments = await Appointment.countDocuments({
    barber: req.user._id,
    status: "pending",
  });

  const cancelledAppointments = await Appointment.countDocuments({
    barber: req.user._id,
    status: "cancelled",
  });

  const revenue = await Appointment.aggregate([
    {
      $match: {
        barber: req.user._id,
        paymentStatus: "paid",
      },
    },
    {
      $group: {
        _id: null,
        totalRevenue: {
          $sum: "$totalPrice",
        },
      },
    },
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalAppointments,
        completedAppointments,
        pendingAppointments,
        cancelledAppointments,
        totalRevenue: revenue[0]?.totalRevenue || 0,
      },
      "Barber statistics fetched successfully"
    )
  );
});