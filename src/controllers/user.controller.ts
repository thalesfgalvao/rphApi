import { type Request, type Response } from "express";
import {
  getUserByIdService,
  createUserService,
} from "../services/user.service.js";

export const getUserByIdController = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const user = await getUserByIdService(id);
  return res.status(200).json(user);
};

export const createUserController = async (req: Request, res: Response) => {
  const { nick, email, password } = req.body;
  const result = await createUserService(nick, email, password);

  if (!result.success) {
    return res.status(409).json(result);
  }
  return res.status(201).json(result);
};
