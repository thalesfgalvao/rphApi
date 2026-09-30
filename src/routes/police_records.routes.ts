import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  createPoliceRecordsController,
  getPoliceRecordsByUserIdController,
  getPoliceRecordsController,
  giveNewPositionController,
  updatePoliceRecordsController,
} from "../controllers/police_records.controller.js";
import { requireFlag } from "../middlewares/flag.middleware.js";

const router = Router();

router.get("/policeRecords", authMiddleware, getPoliceRecordsController);
router.get(
  "/policeRecords/:id",
  authMiddleware,
  getPoliceRecordsByUserIdController,
);
router.post("/policeRecords", authMiddleware, createPoliceRecordsController);
router.patch(
  "/policeRecords/:requirementId",
  authMiddleware,
  updatePoliceRecordsController,
);
router.patch(
  "/policeRecords/:userId/givePosition",
  authMiddleware,
  requireFlag("Oficiais"),
  giveNewPositionController,
);

export default router;
