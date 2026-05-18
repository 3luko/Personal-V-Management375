// server/server.js
// Main server file for the Personal Vehicle Management application, setting up Express, connecting to MongoDB, and defining routes

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import { router as userRoutes } from "./routes/users.js";
import { router as recordRoutes } from "./routes/records.js";
import { router as vehicleRoutes } from "./routes/vehicles.js";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "../client")));
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/pages/login.html"));
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/records", recordRoutes);
app.use("/api/vehicles", vehicleRoutes);

// Start server
async function startServer() {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error("Server failed to start:", err.message);
    }
}

startServer();
