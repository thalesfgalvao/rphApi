import {
  createPoliceRecords,
  getPoliceRecords,
  getPoliceRecordsByUserId,
  updatePoliceRecords,
} from "../repositories/police_records.repository.js";
import {
  getRequirementById,
} from "../repositories/requirements.repository.js";

export const getPoliceRecordsService = async () => {
  const response = await getPoliceRecords();
  if (!response) {
    return { success: false, message: "Não encontrado." };
  }
  return response;
};

export const getPoliceRecordsByUserIdService = async (id: number) => {
  const [response] = await getPoliceRecordsByUserId(id);
  if (!response) {
    return { success: false, message: "Não encontrado." };
  }
  return response;
};

export const createPoliceRecordsService = async (
  userId: number,
  positionId: number,
  identification: string,
  updatedAt: Date,
  updatedBy: number,
  relatedRequirementId: number,
) => {
  const [policeRecord] = await getPoliceRecordsByUserId(userId);

  if (policeRecord) {
    return {
      success: false,
      message: "Usuário já possui um registro.",
    };
  }

  await createPoliceRecords(
    userId,
    positionId,
    identification,
    updatedAt,
    updatedBy,
    relatedRequirementId,
  );

  return {
    success: true,
    message: "Registro policial criado com sucesso.",
  };
};

export const updatePoliceRecordsService = async (
  relatedRequirementId: number,
) => {
  const [requirement] = await getRequirementById(relatedRequirementId);
  if (!requirement) {
    return { success: false, message: "Requerimento não encontrado" };
  }
  const userId = requirement.targetUserId;
  const positionId = requirement.newPosition;
  const identification = requirement.identification;
  const updatedAt = requirement.createdAt;
  const updatedBy = requirement.approvedBy;
  relatedRequirementId = requirement.id;
  await updatePoliceRecords(
    positionId,
    identification,
    updatedAt,
    updatedBy,
    relatedRequirementId,
    userId,
  );
};
