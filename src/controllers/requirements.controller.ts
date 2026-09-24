import {
  getRequerimentService,
  createRequirementService,
  getRequirementByIdService,
  approveRequirementService,
  updatePoliceRecordsService,
} from "../services/requeriments.service.js";
import { type Response, type Request } from "express";
import { http } from "../constants/httpStatus.js";

const { success, unauthorized } = http;

export const getRequerimentController = async (req: Request, res: Response) => {
  const targetUserId = Number(req.params.targetUserId);
  const response = await getRequerimentService(targetUserId);
  return res.status(success).json(response);
};

export const getRequirementByIdController = async (
  req: Request,
  res: Response,
) => {
  const id = Number(req.params.id);
  const response = await getRequirementByIdService(id);
  return res.status(success).json(response);
};

export const approveRequirementController = async (
  req: Request,
  res: Response,
) => {
  const id = Number(req.params.id);
  const approvedBy = req.userId;

  if (!approvedBy) {
    return res.status(unauthorized).json({
      success: false,
      message: "Não autorizado.",
    });
  }

  const response = await approveRequirementService(id, approvedBy);

  return res.status(success).json(response);
};

export const updatePoliceRecordsController = async (
  req: Request,
  res: Response,
) => {
  const {
    positionId,
    identification,
    updatedAt,
    updatedBy,
    relatedRequirementId,
    userId,
  } = req.body;
  const response = await updatePoliceRecordsService(
    positionId,
    identification,
    updatedAt,
    updatedBy,
    relatedRequirementId,
    userId,
  );
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
