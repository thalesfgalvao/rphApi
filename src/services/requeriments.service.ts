import { is } from "zod/locales";
import {
  approveRequirement,
  updatePoliceRecords,
  createRequirement,
  getAllRequirements,
  getPositionByLevelAndCorps,
  getTagByUserId,
  getRequirementByUserId,
} from "../repositories/requirements.repository.js";
import { getUserById } from "../repositories/user.repository.js";
import { formatIdentificationDate } from "../utils/date.js";

export const getAllRequirementsService = async () => {
  const response = await getAllRequirements();
  return response;
};

export const getRequirementByUserIdService = async (id: number) => {
  const response = await getRequirementByUserId(id);
  return response;
};

export const approveRequirementService = async (
  id: number,
  approvedBy: number,
) => {
  const [requirementResult] = await getRequirementByUserId(id);
  if (!requirementResult) {
    return {
      success: false,
      message: "Requerimento não encontrado.",
    };
  }
  if (requirementResult.status !== "pending") {
    return {
      success: false,
      message: "O requerimento já foi analisado.",
    };
  }
  let newPositionLevel = requirementResult.positionLevel;

  if (requirementResult.type === "promocao") {
    newPositionLevel += 1;
  }

  if (requirementResult.type === "rebaixamento") {
    newPositionLevel -= 1;
  }
  const [newPosition] = await getPositionByLevelAndCorps(
    newPositionLevel,
    requirementResult.corps,
  );
  if (!newPosition) {
    return {
      success: false,
      message: "Não foi encontrado um cargo válido para esta movimentação.",
    };
  }
  const formattedDate = formatIdentificationDate(requirementResult.createdAt);
  const [tagResult] = await getTagByUserId(requirementResult.requestedBy);

  if (!tagResult) {
    return {
      success: false,
      message: "O autor do requerimento não possui uma TAG.",
    };
  }
  let identificationTag = tagResult.tag;

  if (requirementResult.type === "rebaixamento") {
    identificationTag = `R/${tagResult.tag}`;
  }

  const identification = `${requirementResult.nick} [${identificationTag}] ${formattedDate}`;
  await updatePoliceRecords(
    newPosition.id,
    identification,
    requirementResult.createdAt,
    requirementResult.requestedBy,
    requirementResult.id,
    requirementResult.targetUserId,
  );
  const reviewed = new Date();
  await approveRequirement(approvedBy, reviewed, requirementResult.id);
  return {
    success: true,
    message: "Requerimento aprovado com sucesso.",
  };
};

export const updatePoliceRecordsService = async (
  positionId: number,
  identification: string,
  updatedAt: Date,
  updatedBy: number,
  relatedRequirementId: number,
  userId: number,
) => {
  await updatePoliceRecords(
    positionId,
    identification,
    updatedAt,
    updatedBy,
    relatedRequirementId,
    userId,
  );
  return {
    success: true,
    message: "Police Records atualizado com sucesso.",
  };
};

export const createRequirementService = async (
  targetUserId: number,
  requestedBy: number,
  type: string,
  reason: string,
) => {
  const [targetUser] = await getUserById(targetUserId);
  if (!targetUser) {
    return {
      success: false,
      message: "Usuário não encontrado.",
    };
  }
  if (!targetUser.isAccountActive) {
    return {
      success: false,
      message: "Usuário não está ativo.",
    };
  }
  if (targetUser.corps === "special") {
    return {
      success: false,
      message: "Não é possível realizar requerimentos contra este usuário.",
    };
  }
  const [requestedByUser] = await getUserById(requestedBy);
  if (!requestedByUser) {
    return {
      success: false,
      message: "Autor do requerimento não encontrado.",
    };
  }
  if (targetUserId === requestedBy && type !== "reforma") {
    return {
      success: false,
      message: "Você não pode realizar essa ação a você mesmo.",
    };
  }
  if (requestedByUser.corps !== "special") {
    if (type === "promocao") {
      if (targetUser.positionLevel + 1 >= requestedByUser.positionLevel) {
        return {
          success: false,
          message: "Essa ação só pode ser feita com subalternos.",
        };
      }
    }

    if (type === "rebaixamento" || type === "demissao") {
      if (targetUser.positionLevel >= requestedByUser.positionLevel) {
        return {
          success: false,
          message: "Essa ação só pode ser feita com subalternos.",
        };
      }
    }
  }
  await createRequirement(targetUserId, requestedBy, type, reason);
  return {
    success: true,
    message: "Requerimento criado com sucesso.",
  };
};
