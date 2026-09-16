import { createUserSchema } from "../schemas/user.schema.js";
import { type Request, type Response } from "express";
import { http } from "../constants/httpStatus.js";
import {
  getUserByIdService,
  createUserService,
} from "../services/user.service.js";
const { success, badRequest, created } = http;
export const getUserByIdController = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const user = await getUserByIdService(id);
  return res.status(success).json(user);
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
  return res.status(created).json(user);
};
