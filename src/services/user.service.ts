import {
  getUserById,
  createUser,
  getUserByNick,
  getUserByEmail,
} from "../repositories/user.repository.js";
import argon2 from "argon2";

export const getUserByIdService = async (id: number) => {
  const user = await getUserById(id);
  return user;
};

export const createUserService = async (
  nick: string,
  email: string,
  password: string,
) => {
  const userNick = await getUserByNick(nick);
  const userEmail = await getUserByEmail(email);
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
  if (password.length < 6) {
    return {
      success: false,
      message: "Sua senha precisa ter pelo menos 6 caracteres.",
    };
  }
  const hashedPassword = await argon2.hash(password);
  await createUser(nick, email, hashedPassword);
  return {
    success: true,
    message: `O usuário ${nick} foi criado com êxito.`,
  };
};
