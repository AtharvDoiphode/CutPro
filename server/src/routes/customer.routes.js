import express from "express";

import {
  getDashboard,
  getProfile,
  updateProfile,
  getUpcomingAppointments,
  getPastAppointments,
  getCancelledAppointments,
} from "../controllers/customer.controller.js";

import verifyJWT from "../middleware/verifyJWT.js";

const router = express.Router();

/* -------------------------------------------------------------------------- */
/*                           Customer Routes                                  */
/* -------------------------------------------------------------------------- */

router.get("/dashboard", verifyJWT, getDashboard);

router.get("/profile", verifyJWT, getProfile);

router.patch("/profile", verifyJWT, updateProfile);

router.get(
  "/upcoming-appointments",
  verifyJWT,
  getUpcomingAppointments
);

router.get(
  "/past-appointments",
  verifyJWT,
  getPastAppointments
);

router.get(
  "/cancelled-appointments",
  verifyJWT,
  getCancelledAppointments
);

export default router;