import {
  getAllRequirementsService,
  createRequirementService,
  getRequirementByUserIdService,
  approveRequirementService,
  getRequirementByIdService,
  rejectRequirementService,
} from "../services/requeriments.service.js";
import { updatePoliceRecordsService } from "../services/police_records.service.js";
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
  const id = Number(req.params.id);
  const response = await getRequirementByUserIdService(id);

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
  const reasonApproval = "Requerimento de acordo.";
  const reviewed = new Date();

  if (!approvedBy) {
    return res.status(unauthorized).json({
      success: false,
      message: "Não autorizado.",
    });
  }

  const response = await approveRequirementService(
    approvedBy,
    reviewed,
    reasonApproval,
    id,
  );

  return res.status(success).json(response);
};

export const rejectRequirementController = async (
  req: Request,
  res: Response,
) => {
  const id = Number(req.params.id);
  const approvedBy = req.userId;
  const reasonApproval = "Para mais informações procure pelo responsável.";
  const reviewed = new Date();

  if (!approvedBy) {
    return res.status(unauthorized).json({
      success: false,
      message: "Não autorizado.",
    });
  }

  const response = await rejectRequirementService(
    approvedBy,
    reviewed,
    reasonApproval,
    id,
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
