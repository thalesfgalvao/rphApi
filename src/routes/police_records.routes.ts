import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { getPoliceRecordsController } from "../controllers/police_records.controller.js";

const router = Router();

router.get("/policeRecords", authMiddleware, getPoliceRecordsController);

export default router;
