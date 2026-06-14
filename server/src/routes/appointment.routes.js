import express from "express";

import {
  createAppointment,
  getAvailableSlots,
  getAllAppointments,
  getAppointmentById,
  getCustomerAppointments,
  getBarberAppointments,
  cancelAppointment,
  completeAppointment,
  rescheduleAppointment,
} from "../controllers/appointment.controller.js";

import verifyJWT from "../middleware/verifyJWT.js";
import verifyCustomer from "../middleware/verifyCustomer.js";
import verifyBarber from "../middleware/verifyBarber.js";

const router = express.Router();

/* -------------------------------------------------------------------------- */
/*                              Public Routes                                 */
/* -------------------------------------------------------------------------- */

// View available slots
router.get("/available-slots", getAvailableSlots);

/* -------------------------------------------------------------------------- */
/*                           Protected Routes                                 */
/* -------------------------------------------------------------------------- */

// Get all appointments
router.get(
  "/",
  verifyJWT,
  getAllAppointments
);

// Customer history
router.get(
  "/customer/:customerId",
  verifyJWT,
  verifyCustomer,
  getCustomerAppointments
);

// Barber history
router.get(
  "/barber/:barberId",
  verifyJWT,
  verifyBarber,
  getBarberAppointments
);

// Get appointment by ID
router.get(
  "/:id",
  verifyJWT,
  getAppointmentById
);

// Create appointment (Customer only)
router.post(
  "/",
  verifyJWT,
  verifyCustomer,
  createAppointment
);

// Cancel appointment
router.patch(
  "/:id/cancel",
  verifyJWT,
  cancelAppointment
);

// Complete appointment (Barber only)
router.patch(
  "/:id/complete",
  verifyJWT,
  verifyBarber,
  completeAppointment
);

// Reschedule appointment
router.patch(
  "/:id/reschedule",
  verifyJWT,
  rescheduleAppointment
);

export default router;