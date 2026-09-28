import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  activateUserController,
  deactivateUserController,
  getPendingUsersController,
} from "../controllers/moderate.controller.js";
import { moderatorMiddleware } from "../middlewares/moderate.middleware.js";
import { getAllUsersController } from "../controllers/user.controller.js";

const router = Router();

router.get(
  "/moderate/pendingUsers/",
  authMiddleware,
  moderatorMiddleware,
  getPendingUsersController,
);
router.get(
  "/moderate/users",
  authMiddleware,
  moderatorMiddleware,
  getAllUsersController,
);
router.patch(
  "/moderate/:id/approveUser",
  authMiddleware,
  moderatorMiddleware,
  activateUserController,
);
router.patch(
  "/moderate/:id/disapproveUser",
  authMiddleware,
  moderatorMiddleware,
  deactivateUserController,
);

export default router;
