import {
  activateUserService,
  deactivateUserService,
  getPendingUsersService,
} from "../services/moderate.service.js";
import { type Response, type Request } from "express";
import { http } from "../constants/httpStatus.js";

const { success, unauthorized } = http;

export const getPendingUsersController = async (
  req: Request,
  res: Response,
) => {
  const users = await getPendingUsersService();
  return res.status(success).json(users);
};

export const activateUserController = async (req: Request, res: Response) => {
  const author = req.userId;
  const targetUserId = Number(req.params.id);
  const action = "activated";

  if (!author) {
    return res.status(unauthorized).json({
      success: false,
      message: "Não autorizado.",
    });
  }

  const response = await activateUserService(targetUserId, author, action);

  return res.status(success).json(response);
};

export const deactivateUserController = async (req: Request, res: Response) => {
  const author = req.userId;
  const targetUserId = Number(req.params.id);
  const action = "suspended";

  if (!author) {
    return res.status(unauthorized).json({
      success: false,
      message: "Não autorizado.",
    });
  }

  const response = await deactivateUserService(targetUserId, author, action);

  return res.status(success).json(response);
};
