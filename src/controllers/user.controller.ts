import { type Request, type Response } from "express";
import { getUserById } from "../services/user.service.js";

export const getUserByIdController = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const user = await getUserById(id);
  return res.status(200).json(user);
};
