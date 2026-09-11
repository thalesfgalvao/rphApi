import { findUserById } from "../repositories/user.repository.js";

export const getUserById = async (id: number) => {
  const user = await findUserById(id);

  return user;
};
