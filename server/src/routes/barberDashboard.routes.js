import express from "express";

import {
  getDashboard,
  getProfile,
  updateProfile,
  getTodayAppointments,
  getUpcomingAppointments,
  getCompletedAppointments,
  getStats,
} from "../controllers/barberDashboard.controller.js";

import verifyJWT from "../middleware/verifyJWT.js";

const router = express.Router();

/* -------------------------------------------------------------------------- */
/*                        Barber Dashboard Routes                             */
/* -------------------------------------------------------------------------- */

router.get("/dashboard", verifyJWT, getDashboard);

router.get("/profile", verifyJWT, getProfile);

router.patch("/profile", verifyJWT, updateProfile);

router.get(
  "/today-appointments",
  verifyJWT,
  getTodayAppointments
);

router.get(
  "/upcoming-appointments",
  verifyJWT,
  getUpcomingAppointments
);

router.get(
  "/completed-appointments",
  verifyJWT,
  getCompletedAppointments
);

router.get(
  "/stats",
  verifyJWT,
  getStats
);

export default router;