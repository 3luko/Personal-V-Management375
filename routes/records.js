import express from "express";

export const router = express.Router();

// Test route
router.get("/", (req, res) => {
    res.send("Records route works");
});