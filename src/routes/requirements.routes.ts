import { Router } from "express";
import {
  approveRequirementController,
  createRequirementController,
  getAllRequirementsController,
  getRequirementByUserIdController,
} from "../controllers/requirements.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
const router = Router();

router.get("/requirements", authMiddleware, getAllRequirementsController);
router.get(
  "/requirements/:id",
  authMiddleware,
  getRequirementByUserIdController,
);
router.patch(
  "/requirements/:id/approve",
  authMiddleware,
  approveRequirementController,
);
router.post("/requirements", authMiddleware, createRequirementController);

export default router;
