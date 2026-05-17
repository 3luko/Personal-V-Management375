// vehicles.js - Express router for handling CRUD operations on vehicles and their associated maintenance records in the Personal Vehicle Management application

import express from "express";
import Vehicle from "../models/Vehicle.js";
import Users from "../models/User.js";
import { protectRoute } from "../middleware/authentication.js";

export const router = express.Router();


// 1. GET ALL VEHICLES (with filtering + pagination)
router.get("/", async (req, res) => {
    try {
        const { make, model, year, page = 1, limit = 10 } = req.query;


        let query = {};
        if (make) query.make = { $regex: make, $options: "i" };
        if (model) query.model = { $regex: model, $options: "i" };
        if (year) query.year = year;
        const vehicles = await Vehicle.find(query)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .populate("owner", "name email") // populate owner details
            .populate("records"); // populate maintenance records
        res.json(vehicles);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 1.5 GET ALL VEHICLES FOR ONE OWNER
router.get("/owner/:ownerId", protectRoute, async (req, res) => {
    try {
        const vehicles = await Vehicle.find({ owner: req.params.ownerId })
            .populate("owner", "name email")
            .populate("records");
        res.json(vehicles);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 2. GET VEHICLE BY ID
router.get("/:id", protectRoute, async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id)
            .populate("owner", "name email") // populate owner details
            .populate("records"); // populate maintenance records  
        if (!vehicle) {
            return res.status(404).json({ message: "Vehicle not found" });
        }
        res.json(vehicle);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// 4. CREATE VEHICLE
router.post("/", protectRoute, async (req, res) => {
    try {
        const { make, model, year, vin, owner } = req.body;
        const vehicleData = { make, model, year, owner };

        if (vin && vin.trim()) {
            vehicleData.vin = vin.trim();
        }

        const vehicle = new Vehicle(vehicleData);
        await vehicle.save();

        // Add vehicle to owner's list
        await Users.findByIdAndUpdate (owner, { $push: { vehicles: vehicle._id } });

        res.status(201).json(vehicle);
    } catch (err) {
        if (err.code === 11000 && err.keyPattern?.vin) {
            return res.status(400).json({ message: "VIN must be unique when provided" });
        }

        res.status(400).json({ message: err.message });
    }
});

// 5. UPDATE VEHICLE (FULL UPDATE)
router.put("/:id", protectRoute, async (req, res) => {
    try {
        const { make, model, year, vin, owner } = req.body; 
        const updatedVehicle = await Vehicle.findByIdAndUpdate(
            req.params.id,
            { make, model, year, vin, owner },
            { new: true, runValidators: true }
        );
        if (!updatedVehicle) {
            return res.status(404).json({ message: "Vehicle not found" });
        }   
        res.json(updatedVehicle);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// 5.5 PARTIAL UPDATE VEHICLE
router.patch("/:id", protectRoute, async (req, res) => {
    try {
        const updatedVehicle = await Vehicle.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedVehicle) {
            return res.status(404).json({ message: "Vehicle not found" });
        }
        res.json(updatedVehicle);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// 6. DELETE VEHICLE
router.delete("/:id", protectRoute, async (req, res) => {
    try {
        const deletedVehicle = await Vehicle.findByIdAndDelete(req.params.id);
        if (!deletedVehicle) {
            return res.status(404).json({ message: "Vehicle not found" });
        }
        // Remove vehicle from owner's list
        await Users.findByIdAndUpdate(deletedVehicle.owner, { $pull: { vehicles: deletedVehicle._id } });
        res.json({ message: "Vehicle deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }   
});
