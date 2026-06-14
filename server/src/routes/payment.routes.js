import express from "express";
import { createOrder } from "../controllers/payment.controller.js";
import verifyJWT from "../middleware/verifyJWT.js";
import {
  
  verifyPayment,
   markPaid,
   getPaymentHistory,
   getPaymentStats,
   getInvoice,
} from "../controllers/payment.controller.js";

const router = express.Router();

/* -------------------------------------------------------------------------- */
/*                            Payment Routes                                  */
/* -------------------------------------------------------------------------- */

router.post(
  "/create-order",
  verifyJWT,
  createOrder
);
router.post(
  "/verify",
  verifyJWT,
  verifyPayment
);
router.patch(
  "/mark-paid/:appointmentId",
  verifyJWT,
  markPaid
);  
router.get(
  "/history",
  verifyJWT,
  getPaymentHistory
);
router.get(
  "/stats",
  verifyJWT,
  getPaymentStats
);
router.get(
  "/invoice/:appointmentId",
  verifyJWT,
  getInvoice
);

export default router;