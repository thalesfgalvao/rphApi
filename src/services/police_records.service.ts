import { getPoliceRecords } from "../repositories/police_records.repository.js";

export const getPoliceRecordsService = async () => {
  const response = await getPoliceRecords();
  if (!response) {
    return { success: false, message: "Não encontrado." };
  }
  return response;
};
