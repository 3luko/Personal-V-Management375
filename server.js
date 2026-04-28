const express = require('express');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();

// 1. Connect to the Database
connectDB();

// 2. Middleware for JSON [cite: 11]
app.use(express.json());

// 3. Define Routes (Example) [cite: 72]
app.use('/api/vehicles', require('./routes/vehicles'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));