import { type ResultSetHeader, type RowDataPacket } from "mysql2";
import pool from "../database/connection.js";

export const getPoliceRecords = async () => {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT * FROM police_records;`,
  );
  return rows;
};

export const getPoliceRecordsByUserId = async (id: number) => {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT * FROM police_records WHERE userId = ?;`,
    [id],
  );
  return rows;
};

export const createPoliceRecords = async (
  userId: number,
  positionId: number,
  identification: string,
  updatedAt: Date,
  updatedBy: number,
  relatedRequirementId: number,
) => {
  const [result] = await pool.execute<ResultSetHeader>(
    `INSERT INTO police_records (
      userId,
      positionId,
      identification,
      updatedAt,
      updatedBy,
      relatedRequirementId
    )
    VALUES (?, ?, ?, ?, ?, ?);`,
    [
      userId,
      positionId,
      identification,
      updatedAt,
      updatedBy,
      relatedRequirementId,
    ],
  );

  return result;
};

export const updatePoliceRecords = async (
  positionId: number,
  identification: string,
  updatedAt: Date,
  updatedBy: number,
  relatedRequirementId: number,
  userId: number,
) => {
  const [result] = await pool.execute(
    `UPDATE police_records
     SET positionId = ?,
         identification = ?,
         updatedAt = ?,
         updatedBy = ?,
         relatedRequirementId = ?
     WHERE userId = ?`,
    [
      positionId,
      identification,
      updatedAt,
      updatedBy,
      relatedRequirementId,
      userId,
    ],
  );

  return result;
};
