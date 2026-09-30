import { type Request, type Response } from "express";
import {
  createPoliceRecordsService,
  getPoliceRecordsByUserIdService,
  getPoliceRecordsService,
  giveNewPositionService,
  updatePoliceRecordsService,
} from "../services/police_records.service.js";
import { http } from "../constants/httpStatus.js";

const { success, unauthorized } = http;

export const getPoliceRecordsController = async (
  req: Request,
  res: Response,
) => {
  const response = await getPoliceRecordsService();
  return res.status(success).json(response);
};

export const getPoliceRecordsByUserIdController = async (
  req: Request,
  res: Response,
) => {
  const id = Number(req.params.id);
  const response = await getPoliceRecordsByUserIdService(id);
  return res.status(success).json(response);
};

export const createPoliceRecordsController = async (
  req: Request,
  res: Response,
) => {
  const { userId } = req.body;
  const updatedAt = new Date();
  let positionId = 0;
  let identification = "Nick [TAG] DD MM AA";
  let relatedRequirementId = 0;
  let updatedBy = 0;

  const response = await createPoliceRecordsService(
    userId,
    positionId,
    identification,
    updatedAt,
    updatedBy,
    relatedRequirementId,
  );

  return res.status(success).json(response);
};

export const updatePoliceRecordsController = async (
  req: Request,
  res: Response,
) => {
  const requirementId = Number(req.params.requirementId);
  const response = await updatePoliceRecordsService(requirementId);
  return res.status(success).json(response);
};

export const giveNewPositionController = async (
  req: Request,
  res: Response,
) => {
  const userId = Number(req.params.userId);
  const updatedBy = req.userId;

  const { positionId, identification } = req.body;

  if (!updatedBy) {
    return res.status(unauthorized).json({
      success: false,
      message: "Não autorizado.",
    });
  }

  const relatedRequirementId = 0;

  const response = await giveNewPositionService(
    positionId,
    identification,
    relatedRequirementId,
    userId,
    updatedBy,
  );

  return res.status(success).json(response);
};
