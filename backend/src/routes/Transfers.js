// src/routes/transfers.js
import express from "express";
import Transfer from "../models/Transfer.js";
import { authRequired, requireRole } from "../utils/auth.js";

export const transfersRouter = express.Router();

// Create Transfer
transfersRouter.post(
  "/",
  authRequired,
  requireRole("Admin", "LogisticsOfficer", "BaseCommander"),
  async (req, res) => {
    try {
      const transfer = new Transfer({
        base_id_from: req.body.base_id_from,
        base_id_to: req.body.base_id_to,
        equipment_type_id: req.body.equipment_type_id,
        qty: req.body.qty,
        created_by: req.user.id,
      });

      await transfer.save();
      res.status(201).json(transfer);
    } catch (err) {
      res.status(500).json({ error: "Failed to record transfer", detail: err.message });
    }
  }
);

// Get Transfers
transfersRouter.get("/", authRequired, async (req, res) => {
  try {
    const transfers = await Transfer.find()
      .populate("base_id_from", "name")
      .populate("base_id_to", "name")
      .populate("equipment_type_id", "name")
      .populate("created_by", "username")
      .sort({ transferred_at: -1 });

    res.json(transfers);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch transfers", detail: err.message });
  }
});
