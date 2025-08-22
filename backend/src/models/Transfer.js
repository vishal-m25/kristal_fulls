// src/models/Transfer.js
import mongoose from "mongoose";

const transferSchema = new mongoose.Schema({
  base_id_from: { type: mongoose.Schema.Types.ObjectId, ref: "Base", required: true },
  base_id_to: { type: mongoose.Schema.Types.ObjectId, ref: "Base", required: true },
  equipment_type_id: { type: mongoose.Schema.Types.ObjectId, ref: "EquipmentType", required: true },
  qty: { type: Number, required: true },
  transferred_at: { type: Date, default: Date.now },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

// ✅ use default export
const Transfer = mongoose.model("Transfer", transferSchema);
export default Transfer;
