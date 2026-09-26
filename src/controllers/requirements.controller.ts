import {
  getAllRequirementsService,
  createRequirementService,
  getRequirementByUserIdService,
  approveRequirementService,
  updatePoliceRecordsService,
} from "../services/requeriments.service.js";
import { type Response, type Request } from "express";
import { http } from "../constants/httpStatus.js";

const { success, unauthorized } = http;

export const getAllRequirementsController = async (
  req: Request,
  res: Response,
) => {
  const response = await getAllRequirementsService();
  return res.status(success).json(response);
};

export const getRequirementByUserIdController = async (
  req: Request,
  res: Response,
) => {
  console.log("PARAMS:", req.params);

  const id = Number(req.params.id);

  console.log("ID:", id);

  const response = await getRequirementByUserIdService(id);

  console.log("RESPONSE:", response);

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
