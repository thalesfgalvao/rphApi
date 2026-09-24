import { type RowDataPacket } from "mysql2";
import pool from "../database/connection.js";

export const getUserById = async (id: number) => {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT users.id, users.nick, users.status, users.roleId, users.isAccountActive,
      police_records.positionId, police_records.identification, police_records.updatedAt, police_records.updatedBy,
      positions.positionLevel, positions.corps
      FROM users
        LEFT JOIN police_records 
          ON police_records.userId = users.id
        LEFT JOIN positions
          ON positions.id = police_records.positionId
      WHERE users.id = ?`,
    [id],
  );
  return rows;
};

export const getUserByNick = async (nick: string) => {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT users.id, users.nick, users.nick, users.status, users.roleId, users.isAccountActive,
      police_records.positionId, police_records.identification, police_records.updatedAt, police_records.updatedBy,
      positions.id, positions.name AS position, positions.corps, positions.positionLevel
      FROM users
        LEFT JOIN police_records 
          ON police_records.userId = users.id
        LEFT JOIN positions
          ON positions.id = police_records.positionId
      WHERE users.nick = ?`,
    [nick],
  );
  return rows;
};

export const existsUserByNick = async (nick: string) => {
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM users WHERE nick = ?",
    [nick],
  );
  return rows;
};

export const existsUserByEmail = async (email: string) => {
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM users WHERE email = ?",
    [email],
  );
  return rows;
};

export const createUser = async (
  nick: string,
  email: string,
  password: string,
) => {
  const [rows] = await pool.query(
    "INSERT INTO users (nick, email, password) VALUES (?, ?, ?)",
    [nick, email, password],
  );
  return rows;
};
