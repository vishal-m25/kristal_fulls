import mongoose from "mongoose";

const stockMovementSchema = new mongoose.Schema({
  base: { type: mongoose.Schema.Types.ObjectId, ref: "Base", required: true },
  equipmentType: { type: mongoose.Schema.Types.ObjectId, ref: "EquipmentType", required: true },
  qty: { type: Number, required: true },
  movementType: { type: String, enum: ["PURCHASE","TRANSFER","USAGE"], required: true },
  refTable: { type: String, required: true },
  refId: { type: mongoose.Schema.Types.ObjectId, required: true }
});

export default mongoose.model("StockMovement", stockMovementSchema);
