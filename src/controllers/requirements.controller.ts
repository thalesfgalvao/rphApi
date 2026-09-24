import {
  getRequerimentService,
  createRequirementService,
} from "../services/requeriments.service.js";
import { type Response, type Request } from "express";
import { http } from "../constants/httpStatus.js";

const { success, unauthorized } = http;

export const getRequerimentController = async (req: Request, res: Response) => {
  const targetUserId = Number(req.params.targetUserId);
  const response = await getRequerimentService(targetUserId);
  return res.status(success).json(response);
};

export const createRequirementController = async (
  req: Request,
  res: Response,
) => {
  const { targetUserId, type, reason } = req.body;
  const requestedBy = req.userId;

  if (!requestedBy) {
    return res.status(unauthorized).json({
      success: false,
      message: "Não autorizado.",
    });
  }
  const response = await createRequirementService(
    targetUserId,
    requestedBy,
    type,
    reason,
  );
  return res.status(success).json(response);
};
