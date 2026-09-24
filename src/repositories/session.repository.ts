import { type RowDataPacket } from "mysql2";
import pool from "../database/connection.js";

export const saveHashedToken = async (
  userId: number,
  tokenHash: string,
  expiresAt: Date,
) => {
  const [rows] = await pool.query(
    "INSERT INTO sessions (userId, tokenHash, expiresAt) VALUES (?, ?, ?)",
    [userId, tokenHash, expiresAt],
  );
  return rows;
};

export const deleteSessionByUserId = async (userId: number) => {
  const [rows] = await pool.query("DELETE FROM sessions WHERE userId = ?", [
    userId,
  ]);
  return rows;
};

export const getSessionByHashedToken = async (tokenHash: string) => {
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM sessions WHERE tokenHash = ?",
    [tokenHash],
  );
  return rows;
};
