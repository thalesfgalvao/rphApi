import pool from "../database/connection.js";
import {
  createRequirement,
  getRequirement,
} from "../repositories/requirements.repository.js";
import { calculateDaysBetweenDates } from "../utils/date.js";

export const getRequerimentService = async (targetUserId: number) => {
  const response = await getRequirement(targetUserId);
  return response;
};

export const createRequirementService = async (
  targetUserId: number,
  requestedBy: number,
  type: string,
  reason: string,
) => {
  await createRequirement(targetUserId, requestedBy, type, reason);
  return {
    success: true,
    message: "Requerimento criado com sucesso.",
  };
};
