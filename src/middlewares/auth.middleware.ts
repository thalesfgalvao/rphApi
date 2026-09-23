import { type Request, type Response, type NextFunction } from "express";
import { http } from "../constants/httpStatus.js";
import { createHash } from "node:crypto";
import { getSessionByHashedToken } from "../repositories/session.repository.js";

export const authMiddleware = async (
  req: Request,
  res: Response,
  nextFunction: NextFunction,
) => {
  const { unauthorized } = http;
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(unauthorized).json({
      success: false,
      message: "Não autorizado.",
    });
  }
  const [type, token] = authorization.split(" ");
  if (type !== "Bearer" || !token) {
    return res.status(unauthorized).json({
      success: false,
      message: "Não autorizado.",
    });
  }

  const tokenHash = createHash("sha256").update(token).digest("hex");
  const [session] = await getSessionByHashedToken(tokenHash);

  if (!session) {
    return res.status(unauthorized).json({
      success: false,
      message: "Não autorizado.",
    });
  }
  const currentDate = new Date();
  if (session.expiresAt < currentDate) {
    return res.status(unauthorized).json({
      success: false,
      message: "Sua sessão expirou.",
    });
  }
  req.userId = session.userId;
  nextFunction();
};
