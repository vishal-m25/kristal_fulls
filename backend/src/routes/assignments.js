import express from "express";
import Assignment from "../models/Assignment.js";
import StockMovement from "../models/StockMovement.js";
import { authRequired, requireRole } from "../utils/auth.js";

export const assignmentsRouter = express.Router();

// Assign
assignmentsRouter.post(
  "/assign",
  authRequired,
  requireRole("Admin", "BaseCommander"),
  async (req, res) => {
    try {
      const { base_id, equipment_type_id, assigned_to, assigned_to_idno, qty, assigned_at } = req.body;
      const userId = req.user.id;

      const assignment = await Assignment.create({
        base_id,
        equipment_type_id,
        assigned_to,
        assigned_to_idno: assigned_to_idno || null,
        qty,
        assigned_at: assigned_at || new Date(),
        created_by: userId
      });

      await StockMovement.create({
        base_id,
        equipment_type_id,
        qty: -Math.abs(qty),
        movement_type: "ASSIGN",
        ref_table: "assignments",
        ref_id: assignment._id
      });

      res.status(201).json({ id: assignment._id });
    } catch (e) {
      res.status(500).json({ error: "Failed to assign", detail: e.message });
    }
  }
);

// Expend
assignmentsRouter.post(
  "/expend",
  authRequired,
  requireRole("Admin", "BaseCommander", "LogisticsOfficer"),
  async (req, res) => {
    try {
      const { base_id, equipment_type_id, qty, reason, expended_at } = req.body;
      const userId = req.user.id;

      const exp = await Expenditure.create({
        base_id,
        equipment_type_id,
        qty,
        reason: reason || null,
        expended_at: expended_at || new Date(),
        created_by: userId
      });

      await StockMovement.create({
        base_id,
        equipment_type_id,
        qty: -Math.abs(qty),
        movement_type: "EXPEND",
        ref_table: "expenditures",
        ref_id: exp._id
      });

      res.status(201).json({ id: exp._id });
    } catch (e) {
      res.status(500).json({ error: "Failed to expend", detail: e.message });
    }
  }
);

// History
assignmentsRouter.get("/", authRequired, async (req, res) => {
  try {
    const { baseId, role } = req.user;

    const query = role === "Admin" ? {} : { base_id: baseId };

    const rows = await Assignment.find(query)
      .populate("equipment_type_id", "name")
      .populate("base_id", "name")
      .sort({ assigned_at: -1 });

    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch assignments", detail: e.message });
  }
});
