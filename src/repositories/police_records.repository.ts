import { type RowDataPacket } from "mysql2";
import pool from "../database/connection.js";

export const getPoliceRecords = async () => {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT * FROM police_records;`,
  );
  return rows;
};
