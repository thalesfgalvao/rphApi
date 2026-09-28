import { Router } from "express";
import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.js";
import requirementRoute from "./requirements.routes.js";
import modRoute from "./moderate.routes.js";
import policeRecords from "./police_records.routes.js";

const router = Router();

router.use(userRoutes, authRoutes, requirementRoute, modRoute, policeRecords);

export default router;
