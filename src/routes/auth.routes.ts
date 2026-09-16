import { Router } from "express";
import { getUserForLoginController } from "../controllers/login.controller.js";
const router = Router();

router.post("/auth/login/", getUserForLoginController);

export default router;
