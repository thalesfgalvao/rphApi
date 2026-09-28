import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  createPoliceRecordsController,
  getPoliceRecordsByUserIdController,
  getPoliceRecordsController,
  updatePoliceRecordsController,
} from "../controllers/police_records.controller.js";

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

export default router;
