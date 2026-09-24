import { Router } from "express";
import {
  createRequirementController,
  getRequerimentController,
} from "../controllers/requirements.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
const router = Router();

router.get("/requirements/:id", authMiddleware, getRequerimentController);
router.post("/requirements", authMiddleware, createRequirementController);

export default router;
