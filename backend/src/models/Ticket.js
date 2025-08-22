import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  visitorName: { type: String, required: true },
  museumName: { type: String, required: true },
  date: { type: Date, required: true },
  price: { type: Number, required: true },
  bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

export default mongoose.model("Ticket", ticketSchema);
