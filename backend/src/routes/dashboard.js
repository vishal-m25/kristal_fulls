import express from "express";
import { authRequired } from "../utils/auth.js";
import { db } from "../db.js";

export const dashboardRouter = express.Router();

// Helper function to build filters
const buildFilters = ({ role, baseId, base_id, equipment_type_id, date_from, date_to }) => {
  const filter = {};
  if (role !== "Admin") {
    filter.base_id = baseId;
  } else if (base_id) {
    filter.base_id = base_id;
  }
  if (equipment_type_id) filter.equipment_type_id = equipment_type_id;
  if (date_from || date_to) filter.created_at = {};
  if (date_from) filter.created_at.$gte = new Date(date_from);
  if (date_to) filter.created_at.$lte = new Date(date_to);
  return filter;
};

// Dashboard summary
dashboardRouter.get("/summary", authRequired, async (req, res) => {
  try {
    const { role, baseId } = req.user;
    const { date_from, date_to, base_id, equipment_type_id } = req.query;

    const filter = buildFilters({ role, baseId, base_id, equipment_type_id, date_from, date_to });

    const agg = await db.collection("stock_movements").aggregate([
      { $match: filter },
      {
        $group: {
          _id: { base_id: "$base_id", equipment_type_id: "$equipment_type_id" },
          opening: { $sum: { $cond: [{ $eq: ["$movement_type", "OPENING"] }, "$qty", 0] } },
          in_qty: { $sum: { $cond: [{ $in: ["$movement_type", ["PURCHASE", "TRANSFER_IN"]] }, "$qty", 0] } },
          out_qty: { $sum: { $cond: [{ $in: ["$movement_type", ["TRANSFER_OUT","ASSIGN","EXPEND"]] }, { $multiply: ["$qty",-1] }, 0] } },
          net_qty: { $sum: "$qty" }
        }
      },
      {
        $lookup: {
          from: "bases",
          localField: "_id.base_id",
          foreignField: "_id",
          as: "base"
        }
      },
      { $unwind: "$base" },
      {
        $lookup: {
          from: "equipment_types",
          localField: "_id.equipment_type_id",
          foreignField: "_id",
          as: "equipment"
        }
      },
      { $unwind: "$equipment" },
      {
        $project: {
          base_id: "$_id.base_id",
          equipment_type_id: "$_id.equipment_type_id",
          opening: 1,
          in_qty: 1,
          out_qty: 1,
          net_qty: 1,
          base_name: "$base.name",
          equipment_name: "$equipment.name"
        }
      },
      { $sort: { base_name: 1, equipment_name: 1 } }
    ]).toArray();

    res.json(agg);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch dashboard summary", detail: err.message });
  }
});

// Net movement detail
dashboardRouter.get("/net-movement-detail", authRequired, async (req,res) => {
  try {
    const { base_id, equipment_type_id, date_from, date_to } = req.query;

    const filter = {};
    if (base_id) filter.base_id = base_id;
    if (equipment_type_id) filter.equipment_type_id = equipment_type_id;
    if (date_from || date_to) filter.created_at = {};
    if (date_from) filter.created_at.$gte = new Date(date_from);
    if (date_to) filter.created_at.$lte = new Date(date_to);
    filter.movement_type = { $in: ["PURCHASE","TRANSFER_IN","TRANSFER_OUT"] };

    const rows = await db.collection("stock_movements")
      .find(filter)
      .sort({ created_at: -1 })
      .toArray();

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch net movement details", detail: err.message });
  }
});
