import razorpay from "../config/razorpay.js";
import Appointment from "../models/Appointment.js";

import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import crypto from "crypto";

const generateInvoiceNumber = () => {
  const now = new Date();

  const year = now.getFullYear();

  const random = Math.floor(
    100000 + Math.random() * 900000
  );

  return `INV-${year}-${random}`;
};

/* -------------------------------------------------------------------------- */
/*                          Create Razorpay Order                             */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                          Create Razorpay Order                             */
/* -------------------------------------------------------------------------- */

export const createOrder = asyncHandler(async (req, res) => {
  const { appointmentId } = req.body;

  if (!appointmentId) {
    throw new ApiError(400, "Appointment ID is required");
  }

  const appointment = await Appointment.findById(appointmentId);

  if (!appointment) {
    throw new ApiError(404, "Appointment not found");
  }

  // Customer can only pay for their own appointment
  if (
    req.user.role === "customer" &&
    appointment.customer.toString() !== req.user._id.toString()
  ) {
    throw new ApiError(
      403,
      "You are not allowed to pay for this appointment"
    );
  }

  // Already paid
  if (appointment.paymentStatus === "paid") {
    throw new ApiError(
      400,
      "Appointment has already been paid"
    );
  }

  // Cancelled appointments cannot be paid
  if (appointment.status === "cancelled") {
    throw new ApiError(
      400,
      "Cancelled appointments cannot be paid"
    );
  }

  // Completed appointments should not create new orders
  if (appointment.status === "completed") {
    throw new ApiError(
      400,
      "Completed appointment cannot create a payment order"
    );
  }

  // Prevent duplicate order creation
  if (appointment.razorpayOrderId) {
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          orderId: appointment.razorpayOrderId,
          amount: appointment.totalPrice * 100,
          currency: "INR",
          key: process.env.RAZORPAY_KEY_ID,
        },
        "Existing Razorpay order returned successfully"
      )
    );
  }

  // Create Razorpay Order
  const order = await razorpay.orders.create({
    amount: appointment.totalPrice * 100,
    currency: "INR",
    receipt: appointment._id.toString(),
  });

  // Save Order Details
  appointment.paymentMethod = "online";
  appointment.razorpayOrderId = order.id;

  await appointment.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        key: process.env.RAZORPAY_KEY_ID,
      },
      "Razorpay order created successfully"
    )
  );
});
/* -------------------------------------------------------------------------- */
/*                        Verify Razorpay Payment                             */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                        Verify Razorpay Payment                             */
/* -------------------------------------------------------------------------- */

export const verifyPayment = asyncHandler(async (req, res) => {
  let {
    appointmentId,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  } = req.body;

  // Trim values
  appointmentId = appointmentId?.trim();
  razorpay_order_id = razorpay_order_id?.trim();
  razorpay_payment_id =
    razorpay_payment_id?.trim();
  razorpay_signature =
    razorpay_signature?.trim();

  if (
    !appointmentId ||
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature
  ) {
    throw new ApiError(
      400,
      "All fields are required"
    );
  }

  // Find appointment
  const appointment =
    await Appointment.findById(appointmentId);

  if (!appointment) {
    throw new ApiError(
      404,
      "Appointment not found"
    );
  }

  // Customer can verify only own payment
  if (
    req.user.role === "customer" &&
    appointment.customer.toString() !==
      req.user._id.toString()
  ) {
    throw new ApiError(
      403,
      "You are not allowed to verify this payment"
    );
  }

  // Already paid
  if (
    appointment.paymentStatus === "paid"
  ) {
    throw new ApiError(
      400,
      "Appointment already paid"
    );
  }

  // Cancelled appointment
  if (
    appointment.status === "cancelled"
  ) {
    throw new ApiError(
      400,
      "Cancelled appointment cannot be paid"
    );
  }

  // Completed appointment
  if (
    appointment.status === "completed"
  ) {
    throw new ApiError(
      400,
      "Completed appointment cannot be paid again"
    );
  }

  // Verify order id
  if (
    appointment.razorpayOrderId !==
    razorpay_order_id
  ) {
    throw new ApiError(
      400,
      "Invalid Razorpay Order ID"
    );
  }

  // Generate expected signature
  const expectedSignature = crypto
    .createHmac(
      "sha256",
      process.env.RAZORPAY_KEY_SECRET
    )
    .update(
      `${razorpay_order_id}|${razorpay_payment_id}`
    )
    .digest("hex");

  // Signature mismatch
  if (
    expectedSignature !==
    razorpay_signature
  ) {
    throw new ApiError(
      400,
      "Invalid Razorpay signature"
    );
  }

  // Payment Success
  appointment.paymentMethod =
    "online";

  appointment.paymentStatus =
    "paid";

  appointment.status =
    "confirmed";

  appointment.razorpayOrderId =
    razorpay_order_id;

  appointment.razorpayPaymentId =
    razorpay_payment_id;

  appointment.razorpaySignature =
    razorpay_signature;

  // Generate invoice once
  if (
    !appointment.invoiceNumber
  ) {
    appointment.invoiceNumber =
      generateInvoiceNumber();

    appointment.invoiceGeneratedAt =
      new Date();
  }

  await appointment.save();

  const updatedAppointment =
    await Appointment.findById(
      appointment._id
    )
      .populate(
        "customer",
        "name email phone"
      )
      .populate(
        "barber",
        "name email phone"
      )
      .populate("services");

  return res.status(200).json(
    new ApiResponse(
      200,
      updatedAppointment,
      "Payment verified successfully"
    )
  );
});
/* -------------------------------------------------------------------------- */
/*                          Mark Cash Payment Paid                            */
/* -------------------------------------------------------------------------- */

export const markPaid = asyncHandler(async (req, res) => {
  const { appointmentId } = req.params;

  const appointment = await Appointment.findById(appointmentId);

  if (!appointment) {
    throw new ApiError(404, "Appointment not found");
  }

  // Only admin or assigned barber can mark as paid
  if (
    req.user.role !== "admin" &&
    appointment.barber.toString() !== req.user._id.toString()
  ) {
    throw new ApiError(
      403,
      "You are not allowed to mark this payment"
    );
  }

  // Only cash payments
  if (appointment.paymentMethod !== "cash") {
    throw new ApiError(
      400,
      "This endpoint is only for cash payments"
    );
  }

  // Already paid
  if (appointment.paymentStatus === "paid") {
    throw new ApiError(
      400,
      "Payment already marked as paid"
    );
  }

  // Cancelled appointments cannot be paid
  if (appointment.status === "cancelled") {
    throw new ApiError(
      400,
      "Cancelled appointment cannot be paid"
    );
  }

  // Update payment
  appointment.paymentStatus = "paid";
  appointment.status = "confirmed";

  // Generate invoice only once
  if (!appointment.invoiceNumber) {
    appointment.invoiceNumber = generateInvoiceNumber();
    appointment.invoiceGeneratedAt = new Date();
  }

  await appointment.save();

  const updatedAppointment = await Appointment.findById(
    appointment._id
  )
    .populate("customer", "name email phone")
    .populate("barber", "name email phone")
    .populate("services");

  return res.status(200).json(
    new ApiResponse(
      200,
      updatedAppointment,
      "Cash payment marked successfully"
    )
  );
});
/* -------------------------------------------------------------------------- */
/*                           Get Payment History                              */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                           Get Payment History                              */
/* -------------------------------------------------------------------------- */

export const getPaymentHistory = asyncHandler(async (req, res) => {
  let filter = {};

  // Customer -> only their payments
  if (req.user.role === "customer") {
    filter.customer = req.user._id;
  }

  // Barber -> only their appointments
  else if (req.user.role === "barber") {
    filter.barber = req.user._id;
  }

  // Exclude cancelled appointments
  filter.status = {
    $ne: "cancelled",
  };

  const payments = await Appointment.find(filter)
    .select(
      `
      customer
      barber
      services
      appointmentDate
      startTime
      endTime
      totalDuration
      totalPrice
      status
      paymentMethod
      paymentStatus
      invoiceNumber
      invoiceGeneratedAt
      `
    )
    .populate("customer", "name email phone")
    .populate("barber", "name email phone")
    .populate("services", "name price duration")
    .sort({
      appointmentDate: -1,
      createdAt: -1,
    });

  return res.status(200).json(
    new ApiResponse(
      200,
      payments,
      "Payment history fetched successfully"
    )
  );
});
/* -------------------------------------------------------------------------- */
/*                           Get Payment Statistics                           */
/* -------------------------------------------------------------------------- */

export const getPaymentStats = asyncHandler(async (req, res) => {
  // Only admin can view payment statistics
  if (req.user.role !== "admin") {
    throw new ApiError(
      403,
      "Only admin can access payment statistics"
    );
  }

  // Revenue
  const totalRevenueResult = await Appointment.aggregate([
    {
      $match: {
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

  const cashRevenueResult = await Appointment.aggregate([
    {
      $match: {
        paymentStatus: "paid",
        paymentMethod: "cash",
      },
    },
    {
      $group: {
        _id: null,
        cashRevenue: {
          $sum: "$totalPrice",
        },
      },
    },
  ]);

  const onlineRevenueResult = await Appointment.aggregate([
    {
      $match: {
        paymentStatus: "paid",
        paymentMethod: "online",
      },
    },
    {
      $group: {
        _id: null,
        onlineRevenue: {
          $sum: "$totalPrice",
        },
      },
    },
  ]);

  // Transaction counts
  const totalTransactions =
    await Appointment.countDocuments();

  const paidTransactions =
    await Appointment.countDocuments({
      paymentStatus: "paid",
    });

  const pendingTransactions =
    await Appointment.countDocuments({
      paymentStatus: "pending",
    });

  const failedTransactions =
    await Appointment.countDocuments({
      paymentStatus: "failed",
    });

  const refundedTransactions =
    await Appointment.countDocuments({
      paymentStatus: "refunded",
    });

  // Average transaction
  const averageTransactionValue =
    paidTransactions > 0
      ? (
          (totalRevenueResult[0]?.totalRevenue || 0) /
          paidTransactions
        ).toFixed(2)
      : 0;

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalRevenue:
          totalRevenueResult[0]?.totalRevenue || 0,

        cashRevenue:
          cashRevenueResult[0]?.cashRevenue || 0,

        onlineRevenue:
          onlineRevenueResult[0]?.onlineRevenue || 0,

        totalTransactions,

        paidTransactions,

        pendingTransactions,

        failedTransactions,

        refundedTransactions,

        averageTransactionValue,
      },
      "Payment statistics fetched successfully"
    )
  );
});
/* -------------------------------------------------------------------------- */
/*                            Get Invoice                                     */
/* -------------------------------------------------------------------------- */

export const getInvoice = asyncHandler(async (req, res) => {
  const { appointmentId } = req.params;

  const appointment = await Appointment.findById(appointmentId)
    .populate("customer", "name email phone")
    .populate("barber", "name email phone")
    .populate("services", "name price duration");

  if (!appointment) {
    throw new ApiError(404, "Appointment not found");
  }

  // Customer can only view their own invoice
  if (
    req.user.role === "customer" &&
    appointment.customer._id.toString() !== req.user._id.toString()
  ) {
    throw new ApiError(
      403,
      "You are not allowed to view this invoice"
    );
  }

  // Barber can only view their own appointment invoice
  if (
    req.user.role === "barber" &&
    appointment.barber._id.toString() !== req.user._id.toString()
  ) {
    throw new ApiError(
      403,
      "You are not allowed to view this invoice"
    );
  }

  const invoice = {
    invoiceNumber: appointment.invoiceNumber || null,
    invoiceGeneratedAt:
      appointment.invoiceGeneratedAt || null,

    appointmentId: appointment._id,

    customer: appointment.customer,

    barber: appointment.barber,

    services: appointment.services,

    appointmentDate: appointment.appointmentDate,

    startTime: appointment.startTime,

    endTime: appointment.endTime,

    totalDuration: appointment.totalDuration,

    totalAmount: appointment.totalPrice,

    paymentMethod: appointment.paymentMethod,

    paymentStatus: appointment.paymentStatus,

    status: appointment.status,
  };

  return res.status(200).json(
    new ApiResponse(
      200,
      invoice,
      "Invoice fetched successfully"
    )
  );
});