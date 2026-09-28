import { type ResultSetHeader, type RowDataPacket } from "mysql2";
import pool from "../database/connection.js";

// GET: SELECT TABLE
export const getAllRequirements = async () => {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT requirements.id, requirements.targetUserId, requirements.requestedBy, requirements.type, requirements.status, requirements.approvedBy, requirements.reviewed,
          requirements.createdAt, requirements.reason, requirements.oldPosition, requirements.newPosition, requirements.reasonApproval, requirements.identification,
          
          positions.id AS positionId, positions.minimumDays, positions.positionLevel, positions.corps,

          targetUser.isAccountActive, targetUser.nick AS targetUserNick,
          requestedUser.nick AS requestedUserNick,

          oldPositionId.name AS oldPositionName,
          newPositionId.name AS newPositionName,
          approvaldUser.nick AS approvalNick

      FROM requirements
      LEFT JOIN police_records
        ON police_records.userId = requirements.targetUserId
      LEFT JOIN positions
        ON positions.id = police_records.positionId
      LEFT JOIN users AS targetUser
        ON targetUser.id = requirements.targetUserId
      LEFT JOIN users AS requestedUser
        ON requestedUser.id = requirements.requestedBy
      LEFT JOIN users AS approvaldUser
        ON approvaldUser.id = requirements.approvedBy
      LEFT JOIN positions AS oldPositionId
        ON oldPositionId.id = requirements.oldPosition
      LEFT JOIN positions AS newPositionId
        ON newPositionId.id = requirements.newPosition

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

          targetUser.isAccountActive, targetUser.nick AS targetUserNick,
          requestedUser.nick AS requestedUserNick,

          oldPositionId.name AS oldPositionName,
          newPositionId.name AS newPositionName,
          approvaldUser.nick AS approvalNick

      FROM requirements
      LEFT JOIN police_records
        ON police_records.userId = requirements.targetUserId
      LEFT JOIN positions
        ON positions.id = police_records.positionId
      LEFT JOIN users AS targetUser
        ON targetUser.id = requirements.targetUserId
      LEFT JOIN users AS requestedUser
        ON requestedUser.id = requirements.requestedBy
      LEFT JOIN users AS approvaldUser
        ON approvaldUser.id = requirements.approvedBy
      LEFT JOIN positions AS oldPositionId
        ON oldPositionId.id = requirements.oldPosition
      LEFT JOIN positions AS newPositionId
        ON newPositionId.id = requirements.newPosition
      WHERE requirements.targetUserId = ?
      ORDER BY requirements.createdAt DESC`,
    [id],
  );

  return rows;
};

export const getRequirementById = async (id: number) => {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT requirements.id, requirements.targetUserId, requirements.requestedBy, requirements.type, requirements.status, requirements.approvedBy, requirements.reviewed,
          requirements.createdAt, requirements.reason, requirements.oldPosition, requirements.newPosition, requirements.reasonApproval, requirements.identification,
          
          positions.id AS positionId, positions.minimumDays, positions.positionLevel, positions.corps,

          targetUser.isAccountActive, targetUser.nick AS targetUserNick,
          requestedUser.nick AS requestedUserNick,

          oldPositionId.name AS oldPositionName,
          newPositionId.name AS newPositionName,
          approvaldUser.nick AS approvalNick

      FROM requirements
      LEFT JOIN police_records
        ON police_records.userId = requirements.targetUserId
      LEFT JOIN positions
        ON positions.id = police_records.positionId
      LEFT JOIN users AS targetUser
        ON targetUser.id = requirements.targetUserId
      LEFT JOIN users AS requestedUser
        ON requestedUser.id = requirements.requestedBy
      LEFT JOIN users AS approvaldUser
        ON approvaldUser.id = requirements.approvedBy
      LEFT JOIN positions AS oldPositionId
        ON oldPositionId.id = requirements.oldPosition
      LEFT JOIN positions AS newPositionId
        ON newPositionId.id = requirements.newPosition
      WHERE requirements.id = ?`,
    [id],
  );

  return rows;
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

// POST: INSERT INTO TABLES
export const createRequirement = async (
  targetUserId: number,
  requestedBy: number,
  type: string,
  reason: string,
  oldPosition: number | null,
  newPosition: number | null,
  identification: string,
) => {
  const [rows] = await pool.query<RowDataPacket[]>(
    `INSERT INTO requirements (targetUserId, requestedBy, type, reason, oldPosition, newPosition, identification) VALUES (?,?,?,?,?,?,?)`,
    [
      targetUserId,
      requestedBy,
      type,
      reason,
      oldPosition,
      newPosition,
      identification,
    ],
  );
  return rows;
};

//UPDATE: UPDATE TABLE
export const approveRequirement = async (
  approvedBy: number,
  reviewed: Date,
  reasonApproval: string,
  id: number,
) => {
  const [result] = await pool.execute<ResultSetHeader>(
    `UPDATE requirements
     SET status = 'approved',
         approvedBy = ?,
         reviewed = ?,
         reasonApproval = ?
     WHERE id = ?`,
    [approvedBy, reviewed, reasonApproval, id],
  );

  return result;
};

export const rejectRequirement = async (
  approvedBy: number,
  reviewed: Date,
  reasonApproval: string,
  id: number,
) => {
  const [result] = await pool.execute<ResultSetHeader>(
    `UPDATE requirements
     SET status = 'rejected',
         approvedBy = ?,
         reviewed = ?,
         reasonApproval = ?
     WHERE id = ?`,
    [approvedBy, reviewed, reasonApproval, id],
  );

  return result;
};
