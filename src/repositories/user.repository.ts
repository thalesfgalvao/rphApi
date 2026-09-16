import { type RowDataPacket } from "mysql2";
import pool from "../database/connection.js";

export const getUserById = async (id: number) => {
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM users WHERE id = ?",
    [id],
  );
  return rows;
};

export const getUserByNick = async (nick: string) => {
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT nick, status FROM users WHERE nick = ?",
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
