// vehicle.js - Mongoose schema and model for vehicles in the Personal Vehicle Management application

import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema({
  make: {
    type: String,
    required: [true, "Make is required"],
    trim: true
  },
  model: {
    type: String,
    required: [true, "Model is required"],
    trim: true
  },
  year: {
    type: Number,
    required: [true, "Year is required"],
    min: [1886, "Enter a valid year"],
    max: [new Date().getFullYear() + 1, "Year cannot be in the far future"]
  },
  vin: {
    type: String,
    unique: true,
    sparse: true,
    uppercase: true,
    minlength: [11, "VIN must be at least 11 characters"],
    maxlength: [17, "VIN cannot exceed 17 characters"]
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  records: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Record"
  }]
}, { timestamps: true });

export default mongoose.model("Vehicle", vehicleSchema);
