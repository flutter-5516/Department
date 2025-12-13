import express from "express";
import {
  ClientProfile,
  getClients,
  getClient,
  updateClient,
  deleteClient,
  summary,
} from "../controllers/ClientController.js";

import isAuth from "../middleware/isAuth.js";

const router = express.Router();
router.use(isAuth);

router.post("/", ClientProfile);    
router.get("/", getClients);   // all clents
router.get("/summary", summary);   
router.get("/:id", getClient);        // Get single client
router.put("/:id", updateClient);     // Update client
router.delete("/:id", deleteClient);  // Delete client

export default router;
