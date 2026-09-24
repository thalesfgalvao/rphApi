import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  activateUserController,
  deactivateUserController,
  getPendingUsersController,
} from "../controllers/moderate.controller.js";

const router = Router();

router.get(
  "/moderate/pendingUsers/",
  authMiddleware,
  getPendingUsersController,
);
router.patch(
  "/moderate/:id/approveUser",
  authMiddleware,
  activateUserController,
);
router.patch(
  "/moderate/:id/disapproveUser",
  authMiddleware,
  deactivateUserController,
);

export default router;
