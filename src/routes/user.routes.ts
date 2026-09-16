import { Router } from "express";
import {
  createUserController,
  getUserByIdController,
  getUserByNickController,
} from "../controllers/user.controller.js";

const router = Router();

router.get("/users/id/:id", getUserByIdController);
router.get("/users/member/:nick", getUserByNickController);
router.post("/users/", createUserController);

export default router;
