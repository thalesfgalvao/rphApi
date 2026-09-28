import { type Request, type Response } from "express";
import { getPoliceRecordsService } from "../services/police_records.service.js";
import { http } from "../constants/httpStatus.js";

const { success } = http;

export const getPoliceRecordsController = async (
  req: Request,
  res: Response,
) => {
  const response = await getPoliceRecordsService();
  return res.status(success).json(response);
};
