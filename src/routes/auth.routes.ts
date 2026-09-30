import { Router } from "express";
import {
  deleteSessionByUserController,
  getUserForLoginController,
  logoutController,
} from "../controllers/login.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
const router = Router();

router.post("/auth/login/", getUserForLoginController);
router.post("/logout", authMiddleware, logoutController);
router.post("/logoutUserSessions/:userId", authMiddleware, deleteSessionByUserController);

export default router;
