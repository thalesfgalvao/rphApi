import { getPendingUsersService } from "../services/moderate.service.js";
import { type Response, type Request } from "express";
import { http } from "../constants/httpStatus.js";

const { success } = http;

export const getPendingUsersController = async (
  req: Request,
  res: Response,
) => {
  const users = await getPendingUsersService();
  return res.status(success).json(users);
};
