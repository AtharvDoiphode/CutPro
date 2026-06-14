import express from "express";

import {
  getDashboardStats,
  getRevenueStats,
  getTopServices,
  getTopBarbers,
  getUpcomingAppointments,
  getDashboardOverview,
} from "../controllers/dashboard.controller.js";

import verifyJWT from "../middleware/verifyJWT.js";
import verifyAdmin from "../middleware/verifyAdmin.js";

const router = express.Router();

router.get(
  "/stats",
  verifyJWT,
  verifyAdmin,
  getDashboardStats
);

router.get(
  "/revenue",
  verifyJWT,
  verifyAdmin,
  getRevenueStats
);

router.get(
  "/top-services",
  verifyJWT,
  verifyAdmin,
  getTopServices
);

router.get(
  "/top-barbers",
  verifyJWT,
  verifyAdmin,
  getTopBarbers
);

router.get(
  "/upcoming-appointments",
  verifyJWT,
  verifyAdmin,
  getUpcomingAppointments
);
router.get(
  "/overview",
  verifyJWT,
  getDashboardOverview
);

export default router;