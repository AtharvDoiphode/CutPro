import express from "express";

import {
  createBarber,
  getAllBarbers,
  getBarberById,
  updateBarber,
  deleteBarber,
  toggleAvailability,
} from "../controllers/barber.controller.js";

import verifyJWT from "../middleware/verifyJWT.js";
import verifyAdmin from "../middleware/verifyAdmin.js";
import verifyBarber from "../middleware/verifyBarber.js";

const router = express.Router();

/* -------------------------- Public Routes -------------------------- */

// Get All Barbers
router.get("/", getAllBarbers);

// Get Barber By ID
router.get("/:id", getBarberById);

/* -------------------------- Admin Routes -------------------------- */

// Create Barber
router.post(
  "/",
  verifyJWT,
  verifyAdmin,
  createBarber
);

// Update Barber
router.put(
  "/:id",
  verifyJWT,
  verifyAdmin,
  updateBarber
);

// Soft Delete Barber
router.delete(
  "/:id",
  verifyJWT,
  verifyAdmin,
  deleteBarber
);

/* -------------------------- Barber Routes -------------------------- */

// Toggle Availability
router.patch(
  "/:id/toggle-availability",
  verifyJWT,
  verifyBarber,
  toggleAvailability
);

export default router;