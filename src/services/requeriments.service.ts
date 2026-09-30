import {
  createRequirement,
  getAllRequirements,
  getRequirementByUserId,
  getRequirementById,
  approveRequirement,
  getPositionByLevelAndCorps,
  rejectRequirement,
} from "../repositories/requirements.repository.js";
import { getUserById } from "../repositories/user.repository.js";
import { formatIdentificationDate } from "../utils/date.js";
import { deactivateUserService } from "./moderate.service.js";
import { updatePoliceRecordsService } from "./police_records.service.js";

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
  const relatedRequirementId = Number(requirement.id);
  await updatePoliceRecordsService(relatedRequirementId);
  return {
    success: true,
    message: "Requerimento aprovado com sucesso.",
  };
};

export const rejectRequirementService = async (
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

  await rejectRequirement(approvedBy, reviewed, reasonApproval, id);
  return {
    success: true,
    message: "Requerimento rejeitado com sucesso.",
  };
};

export const createRequirementService = async (
  targetUserId: number,
  requestedBy: number,
  type: string,
  reason: string,
  positionId?: number,
) => {
  const [targetUser] = await getUserById(targetUserId);
  let identification: string | null = null;
  let oldPosition: number | null = null;
  let newPosition: number | null = null;
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
  if (targetUser.corps === "special" && type !== "contratacao") {
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
    if (
      type === "promocao" &&
      targetUser.positionLevel + 1 >= requestedByUser.positionLevel
    ) {
      return {
        success: false,
        message: "Essa ação só pode ser feita com subalternos.",
      };
    }

    if (
      (type === "rebaixamento" || type === "demissao") &&
      targetUser.positionLevel >= requestedByUser.positionLevel
    ) {
      return {
        success: false,
        message: "Essa ação só pode ser feita com subalternos.",
      };
    }
  }

  if (type === "promocao") {
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

    const date = new Date();
    const formattedData = formatIdentificationDate(date);

    identification = `${targetUser.nick} [${requestedByUser.tag}] ${formattedData}`;
    oldPosition = targetUser.positionId;
    newPosition = nextPosition.id;
  }

  if (type === "rebaixamento") {
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

    const date = new Date();
    const formattedData = formatIdentificationDate(date);

    identification = `${targetUser.nick} [R/${requestedByUser.tag}] ${formattedData}`;
    oldPosition = targetUser.positionId;
    newPosition = previousPosition.id;
  }

  if (type === "reforma") {
    const date = new Date();
    const formattedData = formatIdentificationDate(date);

    identification = `${targetUser.nick} [---] ${formattedData}`;
    oldPosition = targetUser.positionId;

    newPosition = targetUser.positionLevel > 11 ? 135 : 133;

    const isOwnReforma = requestedByUser.id === targetUser.id;

    if (isOwnReforma) {
      reason = `Eu, ${requestedByUser.position} ${requestedByUser.nick}, venho solicitar o meu desligamento honroso devido a ${reason}. Resguardo meu direito de poder retornar a RPH no futuro sem impedimentos.`;
    } else {
      reason = `Eu, ${requestedByUser.position} ${requestedByUser.nick}, detentor(a) da TAG [${requestedByUser.tag}], venho solicitar a reforma do(a) ${targetUser.position} ${targetUser.nick}, detentor da TAG [${targetUser.tag}] sob seu pedido.`;
    }
  }

  if (type === "demissao") {
    const date = new Date();
    const formattedData = formatIdentificationDate(date);

    identification = `${targetUser.nick} [---] ${formattedData}`;
    oldPosition = targetUser.positionId;
    newPosition = 133;

    reason = `Eu, ${requestedByUser.position} ${requestedByUser.nick}, detentor(a) da TAG [${requestedByUser.tag}], venho solicitar o desligamento desonroso do(a) ${targetUser.position} ${targetUser.nick}, detentor da TAG [${targetUser.tag}] devido ao motivo ${reason}. Resguardo seu direito de poder retornar a RPH no futuro sem impedimentos.`;
  }

  if (type === "contratacao") {
    if (targetUser.positionId === 134) {
      return {
        success: false,
        message: "Usuários exonerados não podem ser contratados.",
      };
    }
    if (!positionId) {
      return {
        success: false,
        message: "A patente/cargo da contratação é obrigatória.",
      };
    }

    const date = new Date();
    const formattedData = formatIdentificationDate(date);

    identification = `${targetUser.nick} [${requestedByUser.tag}] ${formattedData}`;
    oldPosition = targetUser.positionId;
    newPosition = positionId;
    reason = "Contratação.";
  }

  if (!identification) {
    return {
      success: false,
      message: "Não foi possível gerar a identificação do requerimento.",
    };
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

  if (type === "demissao" || type === "reforma") {
    await deactivateUserService(targetUserId, requestedBy, type);
  }

  return {
    success: true,
    message: "Requerimento criado com sucesso.",
  };
};
