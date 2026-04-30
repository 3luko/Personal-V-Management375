import express from "express";
import Record from "../models/Record.js";
import Vehicle from "../models/Vehicle.js";
import Users from "../models/User.js";

export const router = express.Router();


// 1. GET ALL RECORDS (with filtering + pagination)
router.get("/", async (req, res) => {
    try {
        const { vehicle, date, page = 1, limit = 10 } = req.query;
        let query = {};
        if (vehicle) query.vehicle = vehicle;
        if (date) query.date = { $gte: new Date(date) };
        const records = await Record.find(query)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .populate("vehicle", "make model year"); // populate vehicle details
        res.json(records);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 2. GET RECORD BY ID
router.get("/:id", async (req, res) => {
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

// 4. GET ALL RECORDS FOR ONE VEHICLE
router.get("/vehicle/:id", async (req, res) => {
    try {
        const records = await Record.find({ vehicle: req.params.id })
            .populate("vehicle", "make model year");
        res.json(records);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 3. CREATE RECORD
router.post("/", async (req, res) => {
    try {
        const { vehicle, date, description, cost } = req.body;
        const record = new Record({ vehicle, date, description, cost });
        await record.save();    
        res.status(201).json(record);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// 4. UPDATE RECORD (FULL UPDATE)
router.put("/:id", async (req, res) => {
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

// 4.5 PARTIAL UPDATE RECORD
router.patch("/:id", async (req, res) => {
    try {
        const record = await Record.findByIdAndUpdate(
            req.params.id,
            req.body,
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

// 5. DELETE RECORD
router.delete("/:id", async (req, res) => {
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