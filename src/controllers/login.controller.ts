import {
  deleteSessionByHashedTokenService,
  getUserForLoginService,
} from "../services/login.service.js";
import { loginUserSchema } from "../schemas/login.schema.js";
import { type Request, type Response } from "express";
import { http } from "../constants/httpStatus.js";
import { createHash } from "node:crypto";
import {
  deleteSessionByUserId,
  getSessionByHashedToken,
} from "../repositories/session.repository.js";

const { success, unauthorized } = http;

export const getUserForLoginController = async (
  req: Request,
  res: Response,
) => {
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

export const deleteSessionByUserController = async (
  req: Request,
  res: Response,
) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({
      success: false,
      message: "Não autorizado.",
    });
  }
  const userId = Number(req.params);
  const response = await deleteSessionByUserId(userId);

  return res.status(success).json(response);
};

export const logoutController = async (req: Request, res: Response) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({
      success: false,
      message: "Não autorizado.",
    });
  }

  const [type, token] = authorization.split(" ");

  if (type !== "Bearer" || !token) {
    return res.status(401).json({
      success: false,
      message: "Não autorizado.",
    });
  }

  const tokenHash = createHash("sha256").update(token).digest("hex");
  const response = await deleteSessionByHashedTokenService(tokenHash);

  return res.status(success).json(response);
};
