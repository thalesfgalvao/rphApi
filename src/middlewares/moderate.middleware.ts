import { type Request, type Response, type NextFunction } from "express";
import { http } from "../constants/httpStatus.js";
import { getUserById } from "../repositories/user.repository.js";

const { unauthorized, forbidden } = http;

export const moderatorMiddleware = async (
  req: Request,
  res: Response,
  nextFunction: NextFunction,
) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(unauthorized).json({
      success: false,
      message: "Não autorizado.",
    });
  }
  const [user] = await getUserById(userId);

  if (!user) {
    return res.status(unauthorized).json({
      success: false,
      message: "Usuário não encontrado.",
    });
  }
  if (user.roleId !== 1 && user.roleId !== 2) {
    return res.status(forbidden).json({
      success: false,
      message: "Você não possui permissão para realizar esta ação.",
    });
  }
  nextFunction();
};
