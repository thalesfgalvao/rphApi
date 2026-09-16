import { getUserForLoginService } from "../services/login.service.js";
import { loginUserSchema } from "../schemas/login.schema.js";
import { type Request, type Response } from "express";
import { http } from "../constants/httpStatus.js";

export const getUserForLoginController = async (
  req: Request,
  res: Response,
) => {
  const { success, unauthorized } = http;
  const result = loginUserSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(success).json({
      errors: result.error.issues.map((error) => ({
        field: error.path[0],
        message: error.message,
      })),
    });
  }
  const { nick, password } = result.data;
  const user = await getUserForLoginService(nick, password);

  if (!user.success) {
    return res.status(unauthorized).json(user);
  }
  return res.status(success).json(user);
};
