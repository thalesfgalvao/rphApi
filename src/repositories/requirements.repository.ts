import { type RowDataPacket } from "mysql2";
import pool from "../database/connection.js";

export const getRequirement = async (targetUserId: number) => {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT requirements.targetUserId, requirements.requestedBy, requirements.status, requirements.reason, requirements.createdAt,
            police_records.userId, police_records.positionId, police_records.updatedAt,
            positions.id AS positionId, positions.minimumDays,
            users.isAccountActive
    FROM requirements
    LEFT JOIN police_records 
        ON police_records.userId = requirements.targetUserId
    LEFT JOIN positions
        ON positions.id = police_records.positionId
        LEFT JOIN users
        ON requirements.targetUserId = users.id
    WHERE requirements.targetUserId = ?`,
    [targetUserId],
  );
  return rows;
};

export const createRequirement = async (
  targetUserId: number,
  requestedBy: number,
  type: string,
  reason: string,
) => {
  const [rows] = await pool.query<RowDataPacket[]>(
    `INSERT INTO requirements (targetUserId, requestedBy, type, reason) VALUES (?,?,?,?)`,
    [targetUserId, requestedBy, type, reason],
  );
  return rows;
};
