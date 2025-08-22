import express from "express";
import { db } from "../db.js";
import { authRequired } from "../utils/auth.js";

export const masterRouter = express.Router();

// Bases
masterRouter.get("/bases", authRequired, async (req, res) => {
  try {
    const bases = await db.collection("bases").find({}).sort({ name: 1 }).toArray();
    res.json(bases);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch bases", detail: err.message });
  }
});

// Equipment types
masterRouter.get("/equipment-types", authRequired, async (req, res) => {
  try {
    const equipmentTypes = await db.collection("equipment_types").find({}).sort({ name: 1 }).toArray();
    res.json(equipmentTypes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch equipment types", detail: err.message });
  }
});
