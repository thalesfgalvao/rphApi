import { getUserForLogin } from "../repositories/login.repository.js";
import argon2 from "argon2";

export const getUserForLoginService = async (
  nick: string,
  password: string,
) => {
  const [user] = await getUserForLogin(nick);
  if (!user) {
    return {
      success: false,
      message: "Usuário e senha não coincidem ou a conta pode estar inativa.",
    };
  }
  if (!user.isAccountActive) {
    return {
      success: false,
      message: "Usuário e senha não coincidem ou a conta pode estar inativa.",
    };
  }

  const passwordIsValid = await argon2.verify(user.password, password);
  if (!passwordIsValid) {
    return {
      success: false,
      message: "Usuário e senha não coincidem ou a conta pode estar inativa.",
    };
  }

  return {
    success: true,
    message: "Login realizado com sucesso.",
  };
};
