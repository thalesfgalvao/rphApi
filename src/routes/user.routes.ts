import { Router } from "express";
import {
  createUserController,
  getAuthenticatedUserController,
  getUserByIdController,
  getUserByNickController,
} from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/users/id/:id", authMiddleware, getUserByIdController);
router.get("/users/member/:nick", getUserByNickController);
router.get("/auth/me", authMiddleware, getAuthenticatedUserController);
router.post("/users/", createUserController);

export default router;
