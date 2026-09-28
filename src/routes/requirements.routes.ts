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
  approveRequirementController,
);
router.patch(
  "/requirements/:id/reject",
  authMiddleware,
  rejectRequirementController,
);
router.post("/requirements", authMiddleware, createRequirementController);

export default router;
