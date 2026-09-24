import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { getPendingUsersController } from "../controllers/moderate.controller.js";

const router = Router();

router.get("/moderate/pendingUsers/", getPendingUsersController);

export default router;
