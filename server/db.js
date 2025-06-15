const mongoose = require('mongoose');

// MongoDB connection URI
const uri = process.env.DB_CONNECTION_STRING;

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(uri);
        console.log('[2/2] | 🟢 MongoDB connected successfully');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1); // Exit process with failure
    }
};
 
module.exports = connectDB;