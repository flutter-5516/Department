import express from "express";
import {
  createTax,
  getTaxes,
  getTax,
  updateTax,
  deleteTax,
} from "../controllers/TaxController.js";

import isAuth from "../middleware/isAuth.js";

const router = express.Router();
router.use(isAuth);

router.post("/", createTax);
router.get("/", getTaxes);
router.get("/:id", getTax);
router.put("/:id", updateTax);
router.delete("/:id", deleteTax);

export default router;
