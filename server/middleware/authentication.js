// authentication.js - Middleware to protect routes and ensure user is authenticated

import jwt from "jsonwebtoken";
import Users from "../models/User.js";

export const protectRoute = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret");
            console.log("Decoded JWT:", decoded.id); // bug 1
            req.user = await Users.findById(decoded.id).select("-password");
            if (!req.user) {
                console.log("User not found for ID:", decoded.id); // bug 2
                return res.status(401).json({ message: "Not authorized, user not found" });
            }
            console.log("Authenticated user:", req.user.email); // bug 3
            return next();
        } catch (err) {
            console.error("JWT verification error:", err.message); // bug 4
            return res.status(401).json({ message: "Not authorized, token invalid/expired" });
        }
    }
    if (!token) {
        console.log("No token provided in request headers"); // bug 5
        return res.status(401).json({ message: "Not authorized, session token missing" });
    }

};