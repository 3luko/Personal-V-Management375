// users.js - Express router for handling CRUD operations on users and their associated vehicles in the Personal Vehicle Management application

import express from "express";
import Users from "../../models/User.js";
import Vehicle from "../../models/Vehicle.js";

import { taskLog, logRequest } from "../../middleware/logging.js"; 
import { protectRoute } from "../middleware/authentication.js";

export const router = express.Router();

router.use(taskLog);
router.use(logRequest);

const isPasswordValid = await user.comparePassword(password);
if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid email or password" });
}

const token = jwt.sign(
    { id: user._id }, 
    process.env.JWT_SECRET || "default_secret", 
    { expiresIn: "24h" }
);
res.json({
    message: "Login successful",
    user: {
        id: user._id,
        name: user.name,
        email: user.email
    },
    token: token
});


// 1. GET ALL USERS (with filtering + pagination)
router.get("/", async (req, res) => {
    try {
        const { name, page = 1, limit = 10 } = req.query;

        let query = {};

        // Search by name (regex)
        if (name) {
            query.name = { $regex: name, $options: "i" };
        }

        const users = await Users.find(query)
            .limit(limit * 1)
            .skip((page - 1) * limit);

        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 1.5 GET ALL VEHICLES FOR ONE USER
router.get("/:id/vehicles",protectRoute, async (req, res) => {
    try {
        const vehicles = await Vehicle.find({ owner: req.params.id })
            .populate("owner", "name email")
            .populate("records");

        res.json(vehicles);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 1.6 LOGIN USER
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await Users.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        res.json({
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// 2. GET USER BY ID
router.get("/:id", protectRoute, async (req, res) => {
    try {
        const user = await Users.findById(req.params.id)
            .populate("vehicles"); // relationship

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// 4. CREATE USER
router.post("/", async (req, res) => {
    try {
        const { name, email, password, vehicle } = req.body;

        // 1. Create user
        const newUser = new Users({ name, email, password });
        await newUser.save();

        let newVehicle = null;

        // 2. If vehicle exists → create it
        if (vehicle) {
            newVehicle = new Vehicle({
                ...vehicle,
                owner: newUser._id
            });

            await newVehicle.save();

            // 3. Link vehicle to user
            newUser.vehicles.push(newVehicle._id);
            await newUser.save();
        }

        res.status(201).json({
            user: newUser,
            vehicle: newVehicle
        });

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


// 5. UPDATE USER (FULL UPDATE)
router.put("/:id", protectRoute, async (req, res) => {
    try {
        const updatedUser = await Users.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(updatedUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


// 6. PARTIAL UPDATE
router.patch("/:id", protectRoute, async (req, res) => {
    try {
        const updatedUser = await Users.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(updatedUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


// 7. DELETE USER
router.delete("/:id", protectRoute, async (req, res) => {
    try {
        const deletedUser = await Users.findByIdAndDelete(req.params.id);

        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
