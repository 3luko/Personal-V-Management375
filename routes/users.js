import express from "express";
import Users from "../models/User.js";

export const router = express.Router();

// Middleware (you already had this)
router.use((req, res, next) => {
    console.log(`Task route: ${req.method} ${req.originalUrl}`);
    console.log(`Time: ${new Date().toISOString()}`);
    next();
});

const logRequest = function(req, res, next){
    console.log(`Requests: ${req.method} for ${req.path}`);
    next();
}
router.use(logRequest);


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


// 2. GET USER BY ID
router.get("/:id", async (req, res) => {
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
        const user = new Users(req.body);
        const savedUser = await user.save();

        res.status(201).json(savedUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


// 5. UPDATE USER (FULL UPDATE)
router.put("/:id", async (req, res) => {
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
router.patch("/:id", async (req, res) => {
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
router.delete("/:id", async (req, res) => {
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