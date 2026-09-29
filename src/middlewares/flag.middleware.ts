import { type Request, type Response, type NextFunction } from "express";
import { getUserById } from "../repositories/user.repository.js";

export const requireFlag = (flag: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Não autorizado.",
      });
    }

    const [user] = await getUserById(userId);

    if (!user || !user.flags?.includes(flag)) {
      return res.status(403).json({
        success: false,
        message: "Você não possui permissão para realizar esta ação.",
      });
    }

    next();
  };
};
