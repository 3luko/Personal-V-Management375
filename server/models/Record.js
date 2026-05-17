import mongoose from "mongoose";

const recordSchema = new mongoose.Schema({
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vehicle",
    required: [true, "Vehicle reference is required"]
  },
  type: {
    type: String,
    required: [true, "Record type is required"],
    enum: ["Oil Change", "Repair", "Inspection", "Tire Rotation", "Other"]
  },
  cost: {
    type: Number,
    min: [0, "Cost cannot be negative"]
  },
  date: {
    type: Date,
    required: [true, "Date is required"],
    default: Date.now
  },
  mileage: {
    type: Number,
    min: [0, "Mileage cannot be negative"]
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, "Notes cannot exceed 500 characters"]
  }
}, { timestamps: true });

export default mongoose.model("Record", recordSchema);