import { type RowDataPacket } from "mysql2";
import pool from "../database/connection.js";

export const getPendingUsers = async () => {
  const [rows] = await pool.query<RowDataPacket[]>(
    `
    SELECT id, nick, email, isAccountActive, status
    FROM users
    WHERE status = "pending";
    `,
  );
  return rows;
};