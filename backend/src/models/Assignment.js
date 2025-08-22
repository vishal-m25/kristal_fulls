import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema({
  base_id: { type: mongoose.Schema.Types.ObjectId, ref: "Base", required: true },
  equipment_type_id: { type: mongoose.Schema.Types.ObjectId, ref: "EquipmentType", required: true },
  assigned_to: { type: String, required: true },
  assigned_to_idno: { type: String },
  qty: { type: Number, required: true },
  assigned_at: { type: Date, default: Date.now },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

const Assignment = mongoose.model("Assignment", assignmentSchema);
export default Assignment;
