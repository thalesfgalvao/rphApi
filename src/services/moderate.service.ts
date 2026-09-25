import { success } from "zod";
import {
  activateUser,
  createUserMovement,
  deactivateUser,
  getPendingUsers,
} from "../repositories/moderate.repository.js";
import { getUserById } from "../repositories/user.repository.js";

export const getPendingUsersService = async () => {
  const [response] = await getPendingUsers();
  return response;
};

export const activateUserService = async (
  targetUserId: number,
  author: number,
  action: string,
) => {
  const [user] = await getUserById(targetUserId);
  if (!user) {
    return {
      success: false,
      message: "Usuário não encontrado.",
    };
  }
  if (user.status === "exonerado") {
    return {
      success: false,
      message: "Este usuário não pode ser ativado.",
    };
  }
  if (user.isAccountActive && user.status === "active") {
    return {
      success: false,
      message: "Este usuário já foi ativado.",
    };
  }
  await activateUser(targetUserId);
  await createUserMovement(targetUserId, author, action);
  return {
    success: true,
    message: "Usuário ativado com sucesso.",
  };
};

export const deactivateUserService = async (
  targetUserId: number,
  author: number,
  action: string,
) => {
  const [user] = await getUserById(targetUserId);
  if (!user) {
    return {
      success: false,
      message: "Usuário não encontrado.",
    };
  }
  if (!user.isAccountActive && user.status === "suspended") {
    return {
      success: false,
      message: "Este usuário já foi desativado.",
    };
  }
  await deactivateUser(targetUserId);
  await createUserMovement(targetUserId, author, action);
  return {
    success: true,
    message: "Usuário desativado com sucesso.",
  };
};
