import { type RowDataPacket } from "mysql2";
import pool from "../database/connection.js";

export const getUserForLogin = async (nick: string) => {
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT id, nick, password, isAccountActive FROM users WHERE nick = (?)",
    [nick],
  );
  return rows;
};
