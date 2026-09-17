import { getUserForLogin } from "../repositories/login.repository.js";
import { randomBytes, createHash } from "node:crypto";
import { deleteSessionByUserId, saveHashedToken } from "../repositories/session.repository.js";
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

  const token = randomBytes(32).toString("hex");
  const tokenHash = createHash("sha256").update(token).digest("hex");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

  await deleteSessionByUserId(user.id);
  await saveHashedToken(user.id, tokenHash, expiresAt);

  return {
    success: true,
    message: "Login realizado com sucesso.",
    token,
  };
};
