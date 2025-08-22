import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema({
  base: { type: mongoose.Schema.Types.ObjectId, ref: "Base", required: true },
  equipmentType: { type: mongoose.Schema.Types.ObjectId, ref: "EquipmentType", required: true },
  qty: { type: Number, required: true },
  unitCost: { type: Number, required: true },
  vendor: { type: String },
  purchasedAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

export default mongoose.model("Purchase", purchaseSchema);
