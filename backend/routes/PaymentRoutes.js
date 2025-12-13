import isAuth from "../middleware/isAuth.js";
import express from "express";
import {
  createPayment,
  getPayments,
  getPayment,
  updatePayment,
  deletePayment,
} from "../controllers/paymentController.js";

import {
  createPaymentMode,
  getPaymentModes,
  updatePaymentMode,
  deletePaymentMode,
} from "../controllers/paymentModeController.js";


const router = express.Router();
router.use(isAuth);

// Payments
router.post("/payments", createPayment);
router.get("/payments", getPayments);
router.get("/payments/:id", getPayment);
router.put("/payments/:id", updatePayment);
router.delete("/payments/:id", deletePayment);

// Payment Modes
router.post("/payment-modes", createPaymentMode);
router.get("/payment-modes", getPaymentModes);
router.put("/payment-modes/:id", updatePaymentMode);
router.delete("/payment-modes/:id", deletePaymentMode);

export default router;
