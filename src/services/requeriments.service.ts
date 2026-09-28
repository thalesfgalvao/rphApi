import {
  updatePoliceRecords,
  createRequirement,
  getAllRequirements,
  getRequirementByUserId,
  getRequirementById,
  approveRequirement,
  getPositionByLevelAndCorps,
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

export const getRequirementByIdService = async (id: number) => {
  const [response] = await getRequirementById(id);
  return response;
};

export const approveRequirementService = async (
  approvedBy: number,
  reviewed: Date,
  reasonApproval: string,
  id: number,
) => {
  const [requirement] = await getRequirementById(id);

  if (!requirement) {
    return {
      success: false,
      message: "Requerimento não encontrado.",
    };
  }

  if (requirement.status !== "pending") {
    return {
      success: false,
      message: "Este requerimento já foi avaliado.",
    };
  }

  await approveRequirement(approvedBy, reviewed, reasonApproval, id);
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
  let identification = "Nick [TAG] DD MM AAAA";
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
  let oldPosition: number | null = null;
  let newPosition: number | null = null;

  if (type === "promocao") {
    if (
      requestedByUser.corps !== "special" &&
      targetUser.positionLevel + 1 >= requestedByUser.positionLevel
    ) {
      return {
        success: false,
        message: "Essa ação só pode ser feita com subalternos.",
      };
    }

    const [nextPosition] = await getPositionByLevelAndCorps(
      targetUser.positionLevel + 1,
      targetUser.corps,
    );

    if (!nextPosition) {
      return {
        success: false,
        message: "Não existe um cargo disponível para esta promoção.",
      };
    }

    let date = new Date();
    let formattedData = formatIdentificationDate(date);
    identification = `${targetUser.nick} [${requestedByUser.tag}] ${formattedData}`;
    oldPosition = targetUser.positionId;
    newPosition = nextPosition.id;
  }

  if (type === "rebaixamento") {
    if (
      requestedByUser.corps !== "special" &&
      targetUser.positionLevel >= requestedByUser.positionLevel
    ) {
      return {
        success: false,
        message: "Essa ação só pode ser feita com subalternos.",
      };
    }

    const [previousPosition] = await getPositionByLevelAndCorps(
      targetUser.positionLevel - 1,
      targetUser.corps,
    );

    if (!previousPosition) {
      return {
        success: false,
        message: "Não existe um cargo disponível para este rebaixamento.",
      };
    }

    let date = new Date();
    let formattedData = formatIdentificationDate(date);
    identification = `${targetUser.nick} [${requestedByUser.tag}] ${formattedData}`;
    oldPosition = targetUser.positionId;
    newPosition = previousPosition.id;
  }
  await createRequirement(
    targetUserId,
    requestedBy,
    type,
    reason,
    oldPosition,
    newPosition,
    identification,
  );

  return {
    success: true,
    message: "Requerimento criado com sucesso.",
  };
};
