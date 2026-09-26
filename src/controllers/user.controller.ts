import { createUserSchema } from "../schemas/user.schema.js";
import { type Request, type Response } from "express";
import { http } from "../constants/httpStatus.js";
import {
  getUserByIdService,
  createUserService,
  getUserByNickService,
  getAllUsersService,
} from "../services/user.service.js";
const { success, badRequest, created, conflict, notFound, unauthorized } = http;

export const getAllUsersController = async (req: Request, res: Response) => {
  const users = await getAllUsersService();
  return res.status(success).json(users);
};

export const getUserByIdController = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const user = await getUserByIdService(id);
  return res.status(success).json(user);
};

export const getUserByNickController = async (req: Request, res: Response) => {
  const nick = String(req.params.nick);

  if (!nick || nick === "undefined") {
    return res.status(notFound).json({
      message: "Usuário não encontrado",
    });
  }
  const user = await getUserByNickService(nick);
  return res.status(success).json(user.user);
};

export const createUserController = async (req: Request, res: Response) => {
  const result = createUserSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(badRequest).json({
      message: "Dados inválidos",
      errors: result.error.issues.map((error) => ({
        field: error.path[0],
        message: error.message,
      })),
    });
  }

  const { nick, email, password } = result.data;
  const user = await createUserService(nick, email, password);

  if (!user.success) {
    return res.status(conflict).json(user);
  }
  return res.status(created).json(user);
};

export const getAuthenticatedUserController = async (
  req: Request,
  res: Response,
) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(unauthorized).json({
      success: false,
      message: "Não autorizado.",
    });
  }
  const user = await getUserByIdService(userId);
  return res.status(success).json({
    success: true,
    user,
  });
};
