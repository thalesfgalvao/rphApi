import { Router } from "express";
import { getUserByIdController } from "../controllers/user.controller.js";

const router = Router();

router.get("/users/:id", getUserByIdController);

export default router;
