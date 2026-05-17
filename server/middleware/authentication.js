// authentication.js - Middleware to protect routes and ensure user is authenticated

import jwt from "jsonwebtoken";
import Users from "../models/User.js";

export const protectRoute = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await Users.findById(decoded.id).select("-password");
            next();
        } catch (err) {
            res.status(401).json({ message: "Not authorized, token invalid/expired" });
        }
    }
    if (!token) {
        res.status(401).json({ message: "Not authorized, session token missing" });
    }

};