import express from "express";

import {
  createReview,
  getBarberReviews,
  getReviewStats,
  approveReview,
} from "../controllers/review.controller.js";

import verifyJWT from "../middleware/verifyJWT.js";
import verifyAdmin from "../middleware/verifyAdmin.js";

const router = express.Router();

/* -------------------------------------------------------------------------- */
/*                              Review Routes                                 */
/* -------------------------------------------------------------------------- */

// Submit Review (Public)
router.post("/", createReview);

// Get Reviews of a Barber (Public)
router.get(
  "/barber/:barberId",
  getBarberReviews
);

// Get Rating Statistics (Public)
router.get(
  "/stats/:barberId",
  getReviewStats
);

// Approve Review (Admin Only)
router.patch(
  "/:id/approve",
  verifyJWT,
  verifyAdmin,
  approveReview
);

export default router;