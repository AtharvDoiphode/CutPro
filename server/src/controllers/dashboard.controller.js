import Appointment from "../models/Appointment.js";
import User from "../models/User.js";
import Service from "../models/Service.js";

import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import Review from "../models/Review.js";
import Queue from "../models/Queue.js";

/* -------------------------------------------------------------------------- */
/*                          Dashboard Statistics                              */
/* -------------------------------------------------------------------------- */

export const getDashboardStats = asyncHandler(async (req, res) => {
  // Total Customers
  const totalCustomers = await User.countDocuments({
    role: "customer",
  });

  // Total Barbers
  const totalBarbers = await User.countDocuments({
    role: "barber",
    isActive: true,
  });

  // Total Services
  const totalServices = await Service.countDocuments({
    isActive: true,
  });

  // Total Appointments
  const totalAppointments =
    await Appointment.countDocuments();

  // Appointment Status Counts
  const completedAppointments =
    await Appointment.countDocuments({
      status: "completed",
    });

  const pendingAppointments =
    await Appointment.countDocuments({
      status: "pending",
    });

  const cancelledAppointments =
    await Appointment.countDocuments({
      status: "cancelled",
    });

  // Today's Date Range
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  // Today's Appointments
  const todayAppointments =
    await Appointment.countDocuments({
      appointmentDate: {
        $gte: todayStart,
        $lte: todayEnd,
      },
    });

  // Today's Revenue
  const todayRevenueAggregation =
    await Appointment.aggregate([
      {
        $match: {
          appointmentDate: {
            $gte: todayStart,
            $lte: todayEnd,
          },
          paymentStatus: "paid",
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

  const todayRevenue =
    todayRevenueAggregation[0]?.revenue || 0;

  // Total Revenue
  const totalRevenueAggregation =
    await Appointment.aggregate([
      {
        $match: {
          paymentStatus: "paid",
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

  const totalRevenue =
    totalRevenueAggregation[0]?.revenue || 0;

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalCustomers,
        totalBarbers,
        totalServices,
        totalAppointments,
        completedAppointments,
        pendingAppointments,
        cancelledAppointments,
        todayAppointments,
        todayRevenue,
        totalRevenue,
      },
      "Dashboard statistics fetched successfully"
    )
  );
});
/* -------------------------------------------------------------------------- */
/*                           Revenue Statistics                               */
/* -------------------------------------------------------------------------- */

export const getRevenueStats = asyncHandler(async (req, res) => {
  const revenue = await Appointment.aggregate([
    {
      $match: {
        paymentStatus: "paid",
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$appointmentDate" },
          month: { $month: "$appointmentDate" },
          day: { $dayOfMonth: "$appointmentDate" },
        },
        revenue: {
          $sum: "$totalPrice",
        },
      },
    },
    {
      $sort: {
        "_id.year": 1,
        "_id.month": 1,
        "_id.day": 1,
      },
    },
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      revenue,
      "Revenue statistics fetched successfully"
    )
  );
});
/* -------------------------------------------------------------------------- */
/*                             Top Services                                   */
/* -------------------------------------------------------------------------- */

export const getTopServices = asyncHandler(async (req, res) => {
  const services = await Appointment.aggregate([
    {
      $unwind: "$services",
    },
    {
      $group: {
        _id: "$services",
        bookings: {
          $sum: 1,
        },
      },
    },
    {
      $sort: {
        bookings: -1,
      },
    },
    {
      $limit: 5,
    },
    {
      $lookup: {
        from: "services",
        localField: "_id",
        foreignField: "_id",
        as: "service",
      },
    },
    {
      $unwind: "$service",
    },
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      services,
      "Top services fetched successfully"
    )
  );
});
/* -------------------------------------------------------------------------- */
/*                             Top Barbers                                    */
/* -------------------------------------------------------------------------- */

export const getTopBarbers = asyncHandler(async (req, res) => {
  const barbers = await Appointment.aggregate([
    {
      $group: {
        _id: "$barber",
        appointments: {
          $sum: 1,
        },
      },
    },
    {
      $sort: {
        appointments: -1,
      },
    },
    {
      $limit: 5,
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "barber",
      },
    },
    {
      $unwind: "$barber",
    },
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      barbers,
      "Top barbers fetched successfully"
    )
  );
});
/* -------------------------------------------------------------------------- */
/*                        Upcoming Appointments                               */
/* -------------------------------------------------------------------------- */

export const getUpcomingAppointments = asyncHandler(
  async (req, res) => {
    const now = new Date();

    const appointments = await Appointment.find({
      appointmentDate: {
        $gte: now,
      },
      status: "pending",
    })
      .populate(
        "customer",
        "name phone"
      )
      .populate(
        "barber",
        "name"
      )
      .populate(
        "services",
        "name"
      )
      .sort({
        appointmentDate: 1,
        startTime: 1,
      })
      .limit(10);

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
/*                        Admin Dashboard Overview                            */
/* -------------------------------------------------------------------------- */

export const getDashboardOverview = asyncHandler(async (req, res) => {
  if (req.user.role !== "admin") {
    throw new ApiError(
      403,
      "Only admin can access dashboard overview"
    );
  }

  // Users
  const totalCustomers = await User.countDocuments({
    role: "customer",
    isActive: true,
  });

  const totalBarbers = await User.countDocuments({
    role: "barber",
    isActive: true,
  });

  // Appointments
  const totalAppointments =
    await Appointment.countDocuments();

  const pendingAppointments =
    await Appointment.countDocuments({
      status: "pending",
    });

  const completedAppointments =
    await Appointment.countDocuments({
      status: "completed",
    });

  const cancelledAppointments =
    await Appointment.countDocuments({
      status: "cancelled",
    });

  // Today's appointments
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const todayAppointments =
    await Appointment.countDocuments({
      appointmentDate: {
        $gte: todayStart,
        $lte: todayEnd,
      },
    });

  // Revenue
  const revenue = await Appointment.aggregate([
    {
      $match: {
        paymentStatus: "paid",
      },
    },
    {
      $group: {
        _id: "$paymentMethod",
        total: {
          $sum: "$totalPrice",
        },
      },
    },
  ]);

  let cashRevenue = 0;
  let onlineRevenue = 0;

  revenue.forEach((item) => {
    if (item._id === "cash") {
      cashRevenue = item.total;
    }

    if (item._id === "online") {
      onlineRevenue = item.total;
    }
  });

  // Reviews
  const totalReviews =
    await Review.countDocuments({
      isApproved: true,
    });

  const rating = await Review.aggregate([
    {
      $match: {
        isApproved: true,
      },
    },
    {
      $group: {
        _id: null,
        average: {
          $avg: "$rating",
        },
      },
    },
  ]);

  // Queue
  const queueWaiting =
    await Queue.countDocuments({
      status: "waiting",
    });

  const queueServing =
    await Queue.countDocuments({
      status: "serving",
    });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalCustomers,
        totalBarbers,
        totalAppointments,
        todayAppointments,
        pendingAppointments,
        completedAppointments,
        cancelledAppointments,

        totalRevenue:
          cashRevenue + onlineRevenue,

        cashRevenue,
        onlineRevenue,

        averageRating:
          rating[0]?.average?.toFixed(1) || 0,

        totalReviews,

        queueWaiting,
        queueServing,
      },
      "Dashboard overview fetched successfully"
    )
  );
});