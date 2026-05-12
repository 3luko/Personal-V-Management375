import mongoose from "mongoose";
import dotenv from "dotenv";
import Vehicle from "../models/Vehicle.js";

dotenv.config();

async function ensureVehicleIndexes() {
  try {
    const indexes = await Vehicle.collection.indexes();
    const vinIndex = indexes.find((index) => index.name === "vin_1");

    if (vinIndex && !vinIndex.sparse) {
      await Vehicle.collection.dropIndex("vin_1");
    }

    await Vehicle.syncIndexes();
  } catch (error) {
    console.error(`Vehicle index sync error: ${error.message}`);
  }
}

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    await ensureVehicleIndexes();

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
