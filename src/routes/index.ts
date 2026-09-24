import { Router } from "express";
import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.js";
import requirementRoute from "./requirements.routes.js";

const router = Router();

router.use(userRoutes, authRoutes, requirementRoute);

export default router;
