import { type ResultSetHeader, type RowDataPacket } from "mysql2";
import pool from "../database/connection.js";

export const getAllRequirements = async () => {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT 
      requirements.id, requirements.targetUserId, requirements.requestedBy, requirements.type, requirements.status, requirements.approvedBy, requirements.reviewed, requirements.createdAt, requirements.reason,
      requestedUser.nick AS requestedByNick, targetUser.nick AS targetUserNick,
      approvalRequirement.nick AS approvalRequirement

      FROM requirements
        LEFT JOIN users AS requestedUser
        ON requestedUser.id = requirements.requestedBy

        LEFT JOIN users AS targetUser
        ON targetUser.id = requirements.targetUserId

        LEFT JOIN users AS approvalRequirement
        ON approvalRequirement.id = requirements.approvedBy

    ORDER BY id DESC
    `,
  );

  return rows;
};

export const getRequirementByUserId = async (id: number) => {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT requirements.id, requirements.targetUserId, requirements.requestedBy, requirements.type, requirements.status, requirements.approvedBy, requirements.reviewed,
          requirements.createdAt, requirements.reason, requirements.oldPosition, requirements.newPosition, requirements.reasonApproval, requirements.identification,
          
          positions.id AS positionId, positions.minimumDays, positions.positionLevel, positions.corps,

          users.isAccountActive, users.nick
      FROM requirements
      LEFT JOIN police_records
        ON police_records.userId = requirements.targetUserId
      LEFT JOIN positions
        ON positions.id = police_records.positionId
      LEFT JOIN users
        ON users.id = requirements.targetUserId
      WHERE requirements.targetUserId = ?
      ORDER BY requirements.createdAt DESC`,
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
