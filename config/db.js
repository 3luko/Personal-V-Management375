const mongoose = require('mongoose');
require('dotenv').config(); // Loads variables from .env into process.env

const connectDB = async () => {
  try {
    // Attempt to connect using the URI from .env file [cite: 74]
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit process with failure 
  }
};

module.exports = connectDB;