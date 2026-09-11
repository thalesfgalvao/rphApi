import pool from "../database/connection.js";

export const findUserById = async (id: number) => {
  const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
  return rows;
};
