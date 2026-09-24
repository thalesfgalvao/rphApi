import { type ResultSetHeader, type RowDataPacket } from "mysql2";
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

export const activateUser = async (id: number) => {
  const [rows] = await pool.query<ResultSetHeader>(
    `
    UPDATE users
    SET isAccountActive = true,
        status = "active"
    WHERE id = ?
    `,
    [id],
  );
  return rows;
};

export const deactivateUser = async (id: number) => {
  const [rows] = await pool.query<ResultSetHeader>(
    `
    UPDATE users
    SET isAccountActive = false,
        status = "suspended"
    WHERE id = ?
    `,
    [id],
  );
  return rows;
};

export const createUserMovement = async (
  targetUserId: number,
  author: number,
  action: string,
) => {
  const [rows] = await pool.query(
    `
        INSERT INTO user_movements(
            targetUserId, author, action
        )
        VALUES(
            ?, ?, ?
        )
    `,
    [targetUserId, author, action],
  );
  return rows;
};
