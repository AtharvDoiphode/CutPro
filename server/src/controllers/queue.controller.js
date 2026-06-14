import Queue from "../models/Queue.js";
import Appointment from "../models/Appointment.js";

import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

/* -------------------------------------------------------------------------- */
/*                            Customer Check In                               */
/* -------------------------------------------------------------------------- */

export const checkIn = asyncHandler(async (req, res) => {
  const { appointmentId } = req.params;

  const appointment = await Appointment.findById(
    appointmentId
  );

  if (!appointment) {
    throw new ApiError(404, "Appointment not found");
  }

  // Only owner can check in
  if (
    appointment.customer.toString() !==
    req.user._id.toString()
  ) {
    throw new ApiError(
      403,
      "You can only check in for your own appointment"
    );
  }

  // Already checked in?
  const existing = await Queue.findOne({
    appointment: appointmentId,
  });

  if (existing) {
    throw new ApiError(
      400,
      "Already checked in"
    );
  }

  // Last queue number for this barber
  const lastQueue = await Queue.findOne({
    barber: appointment.barber,
  }).sort({
    queueNumber: -1,
  });

  const queueNumber = lastQueue
    ? lastQueue.queueNumber + 1
    : 1;

  const queue = await Queue.create({
    appointment: appointment._id,
    customer: appointment.customer,
    barber: appointment.barber,
    queueNumber,
  });

  return res.status(201).json(
    new ApiResponse(
      201,
      queue,
      "Checked in successfully"
    )
  );
});
/* -------------------------------------------------------------------------- */
/*                            Get Queue Status                                */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                            Get Queue Status                                */
/* -------------------------------------------------------------------------- */

export const getQueueStatus = asyncHandler(async (req, res) => {
  const { appointmentId } = req.params;

  const queue = await Queue.findOne({
    appointment: appointmentId,
  });

  if (!queue) {
    throw new ApiError(404, "Queue entry not found");
  }

  // Security
  if (
    req.user.role === "customer" &&
    queue.customer.toString() !== req.user._id.toString()
  ) {
    throw new ApiError(
      403,
      "You are not allowed to view this queue"
    );
  }

  // Currently serving customer
  const currentServing = await Queue.findOne({
    barber: queue.barber,
    status: "serving",
  });

  // Waiting customers before this queue number
  const waitingQueues = await Queue.find({
    barber: queue.barber,
    status: "waiting",
    queueNumber: {
      $lt: queue.queueNumber,
    },
  }).populate("appointment");

  // Position in queue
  const position = waitingQueues.length + 1;

  // Dynamic estimated wait time
  let estimatedWait = 0;

  waitingQueues.forEach((item) => {
    if (item.appointment?.totalDuration) {
      estimatedWait += item.appointment.totalDuration;
    }
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        queueNumber: queue.queueNumber,
        currentServing: currentServing
          ? currentServing.queueNumber
          : null,
        position,
        estimatedWait,
        status: queue.status,
      },
      "Queue status fetched successfully"
    )
  );
});
/* -------------------------------------------------------------------------- */
/*                         Get Current Serving                                */
/* -------------------------------------------------------------------------- */

export const getCurrentServing = asyncHandler(async (req, res) => {
  const { barberId } = req.params;

  const current = await Queue.findOne({
    barber: barberId,
    status: "serving",
  })
    .populate("customer", "name phone avatar")
    .populate("appointment");

  return res.status(200).json(
    new ApiResponse(
      200,
      current,
      "Current serving fetched successfully"
    )
  );
});
/* -------------------------------------------------------------------------- */
/*                            Next Customer                                   */
/* -------------------------------------------------------------------------- */

export const nextCustomer = asyncHandler(async (req, res) => {
  // Only barber or admin can move the queue
  if (
    req.user.role !== "barber" &&
    req.user.role !== "admin"
  ) {
    throw new ApiError(
      403,
      "Only barber or admin can move the queue"
    );
  }

  // Logged-in barber's ID
  const barberId =
    req.user.role === "admin"
      ? req.params.barberId
      : req.user._id;

  // Find current serving customer
  const current = await Queue.findOne({
    barber: barberId,
    status: "serving",
  });

  // Mark current as completed
  if (current) {
    current.status = "completed";
    await current.save();
  }

  // Find next waiting customer
  const next = await Queue.findOne({
    barber: barberId,
    status: "waiting",
  }).sort({
    queueNumber: 1,
  });

  if (!next) {
    return res.status(200).json(
      new ApiResponse(
        200,
        null,
        "No customers in queue"
      )
    );
  }

  // Move next customer to serving
  next.status = "serving";
  await next.save();

  const populatedQueue = await Queue.findById(next._id)
    .populate("customer", "name phone avatar")
    .populate("appointment");

  return res.status(200).json(
    new ApiResponse(
      200,
      populatedQueue,
      "Next customer is now serving"
    )
  );
});
/* -------------------------------------------------------------------------- */
/*                           Get Live Queue                                   */
/* -------------------------------------------------------------------------- */

export const getLiveQueue = asyncHandler(async (req, res) => {
  const { barberId } = req.params;

  const queue = await Queue.find({
    barber: barberId,
    status: {
      $in: ["waiting", "serving"],
    },
  })
    .populate("customer", "name phone avatar")
    .populate("appointment")
    .sort({
      queueNumber: 1,
    });

  return res.status(200).json(
    new ApiResponse(
      200,
      queue,
      "Live queue fetched successfully"
    )
  );
});

/* -------------------------------------------------------------------------- */
/*                           Queue Analytics                                  */
/* -------------------------------------------------------------------------- */

export const getQueueAnalytics = asyncHandler(async (req, res) => {
  const { barberId } = req.params;

  const servedToday = await Queue.countDocuments({
    barber: barberId,
    status: "completed",
  });

  const waitingNow = await Queue.countDocuments({
    barber: barberId,
    status: "waiting",
  });

  const completedQueues = await Queue.find({
    barber: barberId,
    status: "completed",
  }).populate("appointment");

  let totalDuration = 0;

  completedQueues.forEach((queue) => {
    if (queue.appointment?.totalDuration) {
      totalDuration += queue.appointment.totalDuration;
    }
  });

  const averageServiceTime =
    completedQueues.length > 0
      ? Math.round(
          totalDuration / completedQueues.length
        )
      : 0;

  const longestQueue =
    (
      await Queue.findOne({
        barber: barberId,
      }).sort({
        queueNumber: -1,
      })
    )?.queueNumber || 0;

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        servedToday,
        waitingNow,
        averageServiceTime,
        longestQueue,
      },
      "Queue analytics fetched successfully"
    )
  );
});