import { getPendingUsers } from "../repositories/moderate.repository.js";

export const getPendingUsersService = async () => {
  const [response] = await getPendingUsers();
  return response;
};
