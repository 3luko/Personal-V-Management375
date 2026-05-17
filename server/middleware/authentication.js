// middleware.js - Express middleware for logging requests and handling errors in the Personal Vehicle Management application

import jwt from "jsonwebtoken";
import Users from "../models/User.js";
import express from "express";

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

// export const router = express.Router();

// router.use((req, res, next) => {
//     console.log(`Task route: ${req.method} ${req.originalUrl}`);
//     console.log(`Time: ${new Date().toISOString()}`);
//     next();
// });

// const logRequest = function(req, res, next){
//     console.log(`Requests: ${req.method} for ${req.path}`);
//     next();
// }
// router.use(logRequest);