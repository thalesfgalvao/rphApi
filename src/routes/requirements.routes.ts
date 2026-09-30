import { Router } from "express";
import {
  approveRequirementController,
  createRequirementController,
  getAllRequirementsController,
  getRequirementByIdController,
  getRequirementByUserIdController,
  rejectRequirementController,
} from "../controllers/requirements.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { requireFlag } from "../middlewares/flag.middleware.js";
const router = Router();

router.get("/requirements", authMiddleware, getAllRequirementsController);
router.get(
  "/requirements/:id",
  authMiddleware,
  getRequirementByUserIdController,
);
router.get("/requirement/:id", authMiddleware, getRequirementByIdController);
router.patch(
  "/requirements/:id/approve",
  authMiddleware,
  requireFlag("R. Humanos"),
  approveRequirementController,
);
router.patch(
  "/requirements/:id/reject",
  authMiddleware,
  requireFlag("R. Humanos"),
  rejectRequirementController,
);
router.post("/requirements", authMiddleware, createRequirementController);

export default router;
