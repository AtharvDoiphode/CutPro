
import Appointment from "../models/Appointment.js";
import User from "../models/User.js";
import Service from "../models/Service.js";

import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

const SLOT_INTERVAL = 15;

/* -------------------------------------------------------------------------- */
/*                          Create Appointment                                */
/* -------------------------------------------------------------------------- */

export const createAppointment = asyncHandler(async (req, res) => {
  const {
    customer,
    barber,
    services,
    appointmentDate,
    startTime,
    paymentMethod = "cash",
    notes = "",
  } = req.body;

  // Validate required fields
  if (
    !customer ||
    !barber ||
    !services ||
    services.length === 0 ||
    !appointmentDate ||
    !startTime
  ) {
    throw new ApiError(400, "All required fields are mandatory");
  }

  // SECURITY: Customer can only book for themselves
  if (
    req.user.role === "customer" &&
    req.user._id.toString() !== customer
  ) {
    throw new ApiError(
      403,
      "You can only book appointments for yourself"
    );
  }

  // Check Customer
  const customerExists = await User.findById(customer);

  if (!customerExists) {
    throw new ApiError(404, "Customer not found");
  }

  // Check Barber
  const barberUser = await User.findOne({
    _id: barber,
    role: "barber",
    isActive: true,
  });

  if (!barberUser) {
    throw new ApiError(404, "Barber not found");
  }

  if (!barberUser.isAvailable) {
    throw new ApiError(
      400,
      "Barber is currently unavailable"
    );
  }

  // Check Services
  const selectedServices = await Service.find({
    _id: {
      $in: services,
    },
  });

  if (selectedServices.length !== services.length) {
    throw new ApiError(
      404,
      "One or more services not found"
    );
  }

  // Calculate Total Price & Duration
  let totalPrice = 0;
  let totalDuration = 0;

  selectedServices.forEach((service) => {
    totalPrice += service.price;
    totalDuration += service.duration;
  });

  // Appointment Start
  const appointmentStart = new Date(appointmentDate);

  const [startHour, startMinute] = startTime
    .split(":")
    .map(Number);

  appointmentStart.setHours(
    startHour,
    startMinute,
    0,
    0
  );

  // Appointment End
  const appointmentEnd = new Date(appointmentStart);

  appointmentEnd.setMinutes(
    appointmentEnd.getMinutes() + totalDuration
  );

  const endTime = `${String(
    appointmentEnd.getHours()
  ).padStart(2, "0")}:${String(
    appointmentEnd.getMinutes()
  ).padStart(2, "0")}`;

  // Day Range
  const startOfDay = new Date(appointmentDate);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(appointmentDate);
  endOfDay.setHours(23, 59, 59, 999);

  // Existing Appointments
  const existingAppointments = await Appointment.find({
    barber,
    appointmentDate: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
    status: {
      $ne: "cancelled",
    },
  });

  // Overlap Check
  for (const booking of existingAppointments) {
    const [bookingStartHour, bookingStartMinute] =
      booking.startTime.split(":").map(Number);

    const [bookingEndHour, bookingEndMinute] =
      booking.endTime.split(":").map(Number);

    const bookingStart = new Date(appointmentDate);
    bookingStart.setHours(
      bookingStartHour,
      bookingStartMinute,
      0,
      0
    );

    const bookingEnd = new Date(appointmentDate);
    bookingEnd.setHours(
      bookingEndHour,
      bookingEndMinute,
      0,
      0
    );

    if (
      appointmentStart < bookingEnd &&
      appointmentEnd > bookingStart
    ) {
      throw new ApiError(
        409,
        "Selected time overlaps with an existing appointment"
      );
    }
  }

  // Create Appointment
  const appointment = await Appointment.create({
    customer,
    barber,
    services,
    appointmentDate,
    startTime,
    endTime,
    totalPrice,
    totalDuration,
    paymentMethod,
    notes,
  });

  // Return Populated Appointment
  const createdAppointment = await Appointment.findById(
    appointment._id
  )
    .populate(
      "customer",
      "name email phone avatar"
    )
    .populate(
      "barber",
      "name email phone avatar experience specialization rating startTime endTime"
    )
    .populate("services");

  return res.status(201).json(
    new ApiResponse(
      201,
      createdAppointment,
      "Appointment booked successfully"
    )
  );
});

/* -------------------------------------------------------------------------- */
/*                        Get Available Slots                                 */
/* -------------------------------------------------------------------------- */

export const getAvailableSlots = asyncHandler(async (req, res) => {
  const { barberId, date, services } = req.query;

  if (!barberId || !date || !services) {
    throw new ApiError(
      400,
      "barberId, date and services are required"
    );
  }

  // Barber
  const barber = await User.findById(barberId);

  if (!barber || barber.role !== "barber") {
    throw new ApiError(404, "Barber not found");
  }

  // Services
  const serviceIds = services.split(",");

  const selectedServices = await Service.find({
    _id: {
      $in: serviceIds,
    },
  });

  if (selectedServices.length !== serviceIds.length) {
    throw new ApiError(404, "Invalid service selected");
  }

  let totalDuration = 0;

  selectedServices.forEach((service) => {
    totalDuration += service.duration;
  });

  // Working Hours
  const [startHour, startMinute] = barber.startTime
    .split(":")
    .map(Number);

  const [endHour, endMinute] = barber.endTime
    .split(":")
    .map(Number);

  const openingTime = new Date(date);
  openingTime.setHours(startHour, startMinute, 0, 0);

  const closingTime = new Date(date);
  closingTime.setHours(endHour, endMinute, 0, 0);

  // Fetch appointments for day
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const existingAppointments = await Appointment.find({
    barber: barberId,
    appointmentDate: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
    status: {
      $ne: "cancelled",
    },
  });

  const availableSlots = [];

  let currentSlot = new Date(openingTime);

  while (true) {
    const slotEnd = new Date(currentSlot);

    slotEnd.setMinutes(
      slotEnd.getMinutes() + totalDuration
    );

    if (slotEnd > closingTime) {
      break;
    }

    let isAvailable = true;

    for (const booking of existingAppointments) {
      const [bookingStartHour, bookingStartMinute] =
        booking.startTime.split(":").map(Number);

      const [bookingEndHour, bookingEndMinute] =
        booking.endTime.split(":").map(Number);

      const bookingStart = new Date(date);
      bookingStart.setHours(
        bookingStartHour,
        bookingStartMinute,
        0,
        0
      );

      const bookingEnd = new Date(date);
      bookingEnd.setHours(
        bookingEndHour,
        bookingEndMinute,
        0,
        0
      );

      if (
        currentSlot < bookingEnd &&
        slotEnd > bookingStart
      ) {
        isAvailable = false;
        break;
      }
    }

    if (isAvailable) {
      availableSlots.push(
        `${String(currentSlot.getHours()).padStart(
          2,
          "0"
        )}:${String(
          currentSlot.getMinutes()
        ).padStart(2, "0")}`
      );
    }

    // 15-minute interval
    currentSlot.setMinutes(
      currentSlot.getMinutes() + SLOT_INTERVAL
    );
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      availableSlots,
      "Available slots fetched successfully"
    )
  );
});
/* -------------------------------------------------------------------------- */
/*                        Get All Appointments                                */
/* -------------------------------------------------------------------------- */

export const getAllAppointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find()
    .populate("customer", "name email phone avatar")
    .populate(
      "barber",
      "name email phone avatar experience specialization rating startTime endTime"
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
      "Appointments fetched successfully"
    )
  );
}); 
/* -------------------------------------------------------------------------- */
/*                      Get Appointment By ID                                 */
/* -------------------------------------------------------------------------- */

export const getAppointmentById = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id)
    .populate("customer", "name email phone avatar")
    .populate(
      "barber",
      "name email phone avatar experience specialization rating startTime endTime"
    )
    .populate("services");

  if (!appointment) {
    throw new ApiError(404, "Appointment not found");
  }

  // Only the customer who booked it, the assigned barber,
  // or an admin can view this appointment
  if (
    req.user.role !== "admin" &&
    appointment.customer._id.toString() !== req.user._id.toString() &&
    appointment.barber._id.toString() !== req.user._id.toString()
  ) {
    throw new ApiError(
      403,
      "You are not allowed to view this appointment"
    );
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      appointment,
      "Appointment fetched successfully"
    )
  );
});
/* -------------------------------------------------------------------------- */
/*                    Get Customer Appointments                               */
/* -------------------------------------------------------------------------- */

export const getCustomerAppointments = asyncHandler(async (req, res) => {
  const { customerId } = req.params;

  // Customer can only access their own appointments
  if (
    req.user.role !== "admin" &&
    req.user._id.toString() !== customerId
  ) {
    throw new ApiError(
      403,
      "You are not allowed to view these appointments"
    );
  }

  const appointments = await Appointment.find({
    customer: customerId,
  })
    .populate("customer", "name email phone avatar")
    .populate(
      "barber",
      "name avatar experience specialization rating startTime endTime"
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
      "Customer appointments fetched successfully"
    )
  );
});
/* -------------------------------------------------------------------------- */
/*                     Get Barber Appointments                                */
/* -------------------------------------------------------------------------- */

export const getBarberAppointments = asyncHandler(async (req, res) => {
  const { barberId } = req.params;

  // Barber can only access their own appointments
  if (
    req.user.role !== "admin" &&
    req.user._id.toString() !== barberId
  ) {
    throw new ApiError(
      403,
      "You are not allowed to view these appointments"
    );
  }

  const appointments = await Appointment.find({
    barber: barberId,
  })
    .populate("customer", "name email phone avatar")
    .populate(
      "barber",
      "name avatar experience specialization rating startTime endTime"
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
      "Barber appointments fetched successfully"
    )
  );
});
/* -------------------------------------------------------------------------- */
/*                         Cancel Appointment                                 */
/* -------------------------------------------------------------------------- */

export const cancelAppointment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { cancellationReason } = req.body;

  const appointment = await Appointment.findById(id);

  if (!appointment) {
    throw new ApiError(404, "Appointment not found");
  }

  // Only the customer who booked the appointment or an admin can cancel it
  if (
    req.user.role !== "admin" &&
    appointment.customer.toString() !== req.user._id.toString()
  ) {
    throw new ApiError(
      403,
      "You are not allowed to cancel this appointment"
    );
  }

  if (appointment.status === "cancelled") {
    throw new ApiError(400, "Appointment already cancelled");
  }

  if (appointment.status === "completed") {
    throw new ApiError(
      400,
      "Completed appointment cannot be cancelled"
    );
  }

  // Update status
  appointment.status = "cancelled";
  appointment.cancellationReason =
    cancellationReason || "Cancelled by user";

  // Bonus: If payment was already made, mark it as refunded
  if (appointment.paymentStatus === "paid") {
    appointment.paymentStatus = "refunded";
  }

  await appointment.save();

  // Return populated appointment
  const updatedAppointment = await Appointment.findById(
    appointment._id
  )
    .populate("customer", "name email phone avatar")
    .populate(
      "barber",
      "name email phone avatar experience specialization rating"
    )
    .populate("services");

  return res.status(200).json(
    new ApiResponse(
      200,
      updatedAppointment,
      "Appointment cancelled successfully"
    )
  );
});
/* -------------------------------------------------------------------------- */
/*                        Complete Appointment                                */
/* -------------------------------------------------------------------------- */

export const completeAppointment = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const appointment = await Appointment.findById(id);

  if (!appointment) {
    throw new ApiError(404, "Appointment not found");
  }

  // Only the assigned barber or an admin can complete the appointment
  if (
    req.user.role !== "admin" &&
    appointment.barber.toString() !== req.user._id.toString()
  ) {
    throw new ApiError(
      403,
      "You are not allowed to complete this appointment"
    );
  }

  // Prevent completing cancelled appointments
  if (appointment.status === "cancelled") {
    throw new ApiError(
      400,
      "Cancelled appointment cannot be completed"
    );
  }

  // Prevent completing an already completed appointment
  if (appointment.status === "completed") {
    throw new ApiError(
      400,
      "Appointment is already completed"
    );
  }

  // Bonus: Prevent completing future appointments
  const now = new Date();

  const appointmentDateTime = new Date(
    appointment.appointmentDate
  );

  const [hour, minute] = appointment.startTime
    .split(":")
    .map(Number);

  appointmentDateTime.setHours(hour, minute, 0, 0);

  if (appointmentDateTime > now) {
    throw new ApiError(
      400,
      "Cannot complete an appointment before its scheduled time"
    );
  }

  // Update appointment
  appointment.status = "completed";
  appointment.paymentStatus = "paid";

  await appointment.save();

  // Return populated appointment
  const updatedAppointment = await Appointment.findById(
    appointment._id
  )
    .populate("customer", "name email phone avatar")
    .populate(
      "barber",
      "name email phone avatar experience specialization rating"
    )
    .populate("services");

  return res.status(200).json(
    new ApiResponse(
      200,
      updatedAppointment,
      "Appointment completed successfully"
    )
  );
});
/* -------------------------------------------------------------------------- */
/*                       Reschedule Appointment                               */
/* -------------------------------------------------------------------------- */

export const rescheduleAppointment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { appointmentDate, startTime } = req.body;

  if (!appointmentDate || !startTime) {
    throw new ApiError(
      400,
      "appointmentDate and startTime are required"
    );
  }

  // Find Appointment
  const appointment = await Appointment.findById(id);

  if (!appointment) {
    throw new ApiError(404, "Appointment not found");
  }

  // Only the customer who booked the appointment or an admin can reschedule
  if (
    req.user.role !== "admin" &&
    appointment.customer.toString() !== req.user._id.toString()
  ) {
    throw new ApiError(
      403,
      "You are not allowed to reschedule this appointment"
    );
  }

  // Prevent rescheduling cancelled appointments
  if (appointment.status === "cancelled") {
    throw new ApiError(
      400,
      "Cancelled appointment cannot be rescheduled"
    );
  }

  // Prevent rescheduling completed appointments
  if (appointment.status === "completed") {
    throw new ApiError(
      400,
      "Completed appointment cannot be rescheduled"
    );
  }

  // Create new appointment start time
  const appointmentStart = new Date(appointmentDate);

  const [startHour, startMinute] = startTime
    .split(":")
    .map(Number);

  appointmentStart.setHours(
    startHour,
    startMinute,
    0,
    0
  );

  // Calculate end time
  const appointmentEnd = new Date(appointmentStart);

  appointmentEnd.setMinutes(
    appointmentEnd.getMinutes() +
      appointment.totalDuration
  );

  const endTime = `${String(
    appointmentEnd.getHours()
  ).padStart(2, "0")}:${String(
    appointmentEnd.getMinutes()
  ).padStart(2, "0")}`;

  // Get day range
  const startOfDay = new Date(appointmentDate);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(appointmentDate);
  endOfDay.setHours(23, 59, 59, 999);

  // Fetch existing appointments for same barber
  const existingAppointments = await Appointment.find({
    barber: appointment.barber,
    _id: {
      $ne: appointment._id,
    },
    appointmentDate: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
    status: {
      $ne: "cancelled",
    },
  });

  // Check overlap
  for (const booking of existingAppointments) {
    const [bookingStartHour, bookingStartMinute] =
      booking.startTime.split(":").map(Number);

    const [bookingEndHour, bookingEndMinute] =
      booking.endTime.split(":").map(Number);

    const bookingStart = new Date(appointmentDate);
    bookingStart.setHours(
      bookingStartHour,
      bookingStartMinute,
      0,
      0
    );

    const bookingEnd = new Date(appointmentDate);
    bookingEnd.setHours(
      bookingEndHour,
      bookingEndMinute,
      0,
      0
    );

    if (
      appointmentStart < bookingEnd &&
      appointmentEnd > bookingStart
    ) {
      throw new ApiError(
        409,
        "New time overlaps with another appointment"
      );
    }
  }

  // Update appointment
  appointment.appointmentDate = appointmentDate;
  appointment.startTime = startTime;
  appointment.endTime = endTime;

  await appointment.save();

  // Return populated appointment
  const updatedAppointment = await Appointment.findById(
    appointment._id
  )
    .populate(
      "customer",
      "name email phone avatar"
    )
    .populate(
      "barber",
      "name email phone avatar experience specialization rating startTime endTime"
    )
    .populate("services");

  return res.status(200).json(
    new ApiResponse(
      200,
      updatedAppointment,
      "Appointment rescheduled successfully"
    )
  );
});