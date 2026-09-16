import { Router } from "express";
import {
  createUserController,
  getUserByIdController,
} from "../controllers/user.controller.js";

const router = Router();

router.get("/users/:id", getUserByIdController);
router.post("/users/", createUserController);

export default router;
