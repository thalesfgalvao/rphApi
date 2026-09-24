import { Router } from "express";
import {
  approveRequirementController,
  createRequirementController,
  getRequerimentController,
  getRequirementByIdController,
} from "../controllers/requirements.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
const router = Router();

router.get(
  "/requirements/:targetUserId",
  authMiddleware,
  getRequerimentController,
);
router.patch(
  "/requirements/:id/approve",
  authMiddleware,
  approveRequirementController,
);
router.post("/requirements", authMiddleware, createRequirementController);

export default router;
