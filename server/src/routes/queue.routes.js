import express from "express";

import {
  checkIn,
  getQueueStatus,
  getCurrentServing,
  nextCustomer,
  getLiveQueue,
  getQueueAnalytics,
} from "../controllers/queue.controller.js";

import verifyJWT from "../middleware/verifyJWT.js";

const router = express.Router();

/* -------------------------------------------------------------------------- */
/*                              Queue Routes                                  */
/* -------------------------------------------------------------------------- */

// Customer Check In
router.post(
  "/check-in/:appointmentId",
  verifyJWT,
  checkIn
);

// Queue Status
router.get(
  "/status/:appointmentId",
  verifyJWT,
  getQueueStatus
);

// Current Serving
router.get(
  "/current/:barberId",
  verifyJWT,
  getCurrentServing
);

// Next Customer
router.post(
  "/next/:barberId",
  verifyJWT,
  nextCustomer
);
router.get(
  "/all/:barberId",
  verifyJWT,
  getLiveQueue
);
router.get(
  "/analytics/:barberId",
  verifyJWT,
  getQueueAnalytics
);

export default router;