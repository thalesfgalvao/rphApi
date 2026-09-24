import { type ResultSetHeader, type RowDataPacket } from "mysql2";
import pool from "../database/connection.js";

export const getRequirement = async (targetUserId: number) => {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT requirements.id, requirements.targetUserId, requirements.requestedBy, requirements.status, requirements.reason, requirements.approvedBy, requirements.reviewed, requirements.createdAt,
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

export const getRequirementById = async (id: number) => {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT requirements.id, requirements.targetUserId, requirements.requestedBy, requirements.type, requirements.status, requirements.reason, requirements.approvedBy, requirements.reviewed, requirements.createdAt,
            police_records.userId, police_records.positionId, police_records.updatedAt,
            positions.id AS positionId, positions.minimumDays, positions.positionLevel, positions.corps,
            users.isAccountActive,
            users.nick
    FROM requirements
    LEFT JOIN police_records 
      ON police_records.userId = requirements.targetUserId
    LEFT JOIN positions
      ON positions.id = police_records.positionId
    LEFT JOIN users
      ON requirements.targetUserId = users.id
    WHERE requirements.id = ?`,
    [id],
  );
  return rows;
};

export const approveRequirement = async (
  approvedBy: number,
  reviewed: Date,
  id: number,
) => {
  const [result] = await pool.execute<ResultSetHeader>(
    `UPDATE requirements
     SET status = 'approved',
         approvedBy = ?,
         reviewed = ?
     WHERE id = ?`,
    [approvedBy, reviewed, id],
  );

  return result;
};

export const getTagByUserId = async (userId: number) => {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT id, userId, tag, status, isTagActive
     FROM tags
     WHERE userId = ?`,
    [userId],
  );

  return rows;
};

export const updatePoliceRecords = async (
  positionId: number,
  identification: string,
  updatedAt: Date,
  updatedBy: number,
  relatedRequirementId: number,
  userId: number,
) => {
  const [result] = await pool.execute<ResultSetHeader>(
    `INSERT INTO police_records
      (
        userId,
        positionId,
        identification,
        updatedAt,
        updatedBy,
        relatedRequirementId
      )
      VALUES (?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        positionId = ?,
        identification = ?,
        updatedAt = ?,
        updatedBy = ?,
        relatedRequirementId = ?
    `,
    [
      userId,
      positionId,
      identification,
      updatedAt,
      updatedBy,
      relatedRequirementId,

      positionId,
      identification,
      updatedAt,
      updatedBy,
      relatedRequirementId,
    ],
  );
  return result;
};

export const getPositionByLevelAndCorps = async (
  positionLevel: number,
  corps: string,
) => {
  const [rows] = await pool.query<RowDataPacket[]>(
    `
    SELECT id, name, positionLevel, corps
    FROM positions
    WHERE positionLevel = ?
      AND
          corps = ?
  `,
    [positionLevel, corps],
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
