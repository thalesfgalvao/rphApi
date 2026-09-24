import {
  getUserById,
  createUser,
  existsUserByNick,
  existsUserByEmail,
  getUserByNick,
} from "../repositories/user.repository.js";
import argon2 from "argon2";

export const getUserByIdService = async (id: number) => {
  const [user] = await getUserById(id);
  return user;
};

export const getUserByNickService = async (nick: string) => {
  const [user] = await getUserByNick(nick);
  if (!user) {
    return {
      success: false,
      message: "Usuário não encontrado.",
    };
  }
  return { success: true, user };
};

export const createUserService = async (
  nick: string,
  email: string,
  password: string,
) => {
  const userNick = await existsUserByNick(nick);
  const userEmail = await existsUserByEmail(email);
  if (userNick.length > 0) {
    return {
      success: false,
      message: "Já existe um usuário com este nick.",
    };
  }
  if (userEmail.length > 0) {
    return {
      success: false,
      message: "Já existe um usuário com este email.",
    };
  }
  const hashedPassword = await argon2.hash(password);
  await createUser(nick, email, hashedPassword);
  return {
    success: true,
    message: `O usuário ${nick} foi criado com êxito.`,
  };
};
