import express from "express";
import Purchase from "../models/Purchase.js";
import StockMovement from "../models/StockMovement.js";
import { authRequired, requireRole } from "../utils/auth.js";

export const purchasesRouter = express.Router();

// Create purchase
purchasesRouter.post(
  "/",
  authRequired,
  requireRole("Admin", "LogisticsOfficer", "BaseCommander"),
  async (req, res) => {
    try {
      const { base, equipmentType, qty, unitCost, vendor, purchasedAt } = req.body;
      const userId = req.user.id;

      // Create purchase
      const purchase = new Purchase({
        base,
        equipmentType,
        qty,
        unitCost,
        vendor,
        purchasedAt: purchasedAt || new Date(),
        createdBy: userId
      });
      await purchase.save();

      // Create stock movement
      const stockMovement = new StockMovement({
        base,
        equipmentType,
        qty,
        movementType: "PURCHASE",
        refTable: "purchases",
        refId: purchase._id
      });
      await stockMovement.save();

      res.status(201).json({ id: purchase._id });
    } catch (e) {
      res.status(500).json({ error: "Failed to record purchase", detail: e.message });
    }
  }
);

// Get purchases with filters
purchasesRouter.get("/", authRequired, async (req, res) => {
  try {
    const { baseId, role } = req.user;
    const { base, equipmentType, date_from, date_to } = req.query;

    const filters = {};
    if (role !== "Admin") {
      filters.base = baseId;
    } else if (base) {
      filters.base = base;
    }
    if (equipmentType) filters.equipmentType = equipmentType;
    if (date_from || date_to) {
      filters.purchasedAt = {};
      if (date_from) filters.purchasedAt.$gte = new Date(date_from);
      if (date_to) filters.purchasedAt.$lte = new Date(date_to);
    }

    const purchases = await Purchase.find(filters)
      .populate("equipmentType", "name")
      .populate("base", "name")
      .sort({ purchasedAt: -1 });

    res.json(purchases);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
