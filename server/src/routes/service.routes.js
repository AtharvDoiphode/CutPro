import express from "express";

import {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
} from "../controllers/service.controller.js";

import verifyJWT from "../middleware/verifyJWT.js";
import verifyAdmin from "../middleware/verifyAdmin.js";

const router = express.Router();

/* ----------------------------- Public Routes ----------------------------- */

// Get all services
router.get("/", getAllServices);

// Get service by ID
router.get("/:id", getServiceById);

/* ----------------------------- Admin Routes ------------------------------ */

// Create service
router.post(
  "/",
  verifyJWT,
  verifyAdmin,
  createService
);

// Update service
router.put(
  "/:id",
  verifyJWT,
  verifyAdmin,
  updateService
);

// Delete service
router.delete(
  "/:id",
  verifyJWT,
  verifyAdmin,
  deleteService
);

export default router;