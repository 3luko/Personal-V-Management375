// records.js - Express router for handling CRUD operations on maintenance records associated with vehicles in the Personal Vehicle Management application

import express from "express";
import Record from "../models/Record.js";
import Vehicle from "../models/Vehicle.js";
import { protectRoute } from "../middleware/authentication.js";

export const router = express.Router();

// 1. GET ALL RECORDS (with filtering + pagination)
router.get("/", protectRoute, async (req, res) => {
    try {
        const { vehicle, date, page = 1, limit = 10 } = req.query;
        let query = {};
        if (vehicle) query.vehicle = vehicle;
        if (date) query.date = { $gte: new Date(date) };
        const records = await Record.find(query)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .populate("vehicle", "make model year") // populate vehicle details
            .populate("type") // populate type of vehicle maintenance
            .populate("mileage") // populate mileage of vehicle at time of record
            .populate("date"); // populate date of record
        res.json(records);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 2. GET RECORD BY ID
router.get("/:id", protectRoute, async (req, res) => {
    try {
        const record = await Record.findById(req.params.id)
            .populate("vehicle", "make model year");    
        if (!record) {
            return res.status(404).json({ message: "Record not found" });
        }   
        res.json(record);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 3.  GET ALL RECORDS FOR ONE VEHICLE
router.get("/vehicle/:id", protectRoute, async (req, res) => {
    try {
        const records = await Record.find({ vehicle: req.params.id })
            .populate("vehicle", "make model year")
            .populate("type")
            .populate("mileage")
            .populate("date");
        res.json(records);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 4. CREATE RECORD
router.post("/", protectRoute, async (req, res) => {
    try {
        const { vehicle, date, description, cost } = req.body;
        const record = new Record({ vehicle, date, description, cost });
        await record.save();    
        res.status(201).json(record);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// 5. UPDATE RECORD (FULL UPDATE)
router.put("/:id", protectRoute, async (req, res) => {
    try {
        const { vehicle, date, description, cost } = req.body;
        const record = await Record.findByIdAndUpdate(
            req.params.id,
            { vehicle, date, description, cost },
            { new: true, runValidators: true }
        ).populate("vehicle", "make model year");
        if (!record) {
            return res.status(404).json({ message: "Record not found" });
        }
        res.json(record);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// 6. DELETE RECORD
router.delete("/:id", protectRoute, async (req, res) => {
    try {
        const record = await Record.findByIdAndDelete(req.params.id);
        if (!record) {
            return res.status(404).json({ message: "Record not found" });
        }
        res.json({ message: "Record deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});