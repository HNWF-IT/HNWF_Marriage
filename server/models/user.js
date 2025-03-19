const mongoose = require("mongoose");

// Define the user schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// Create the model from the schema
const User = mongoose.model('User', userSchema);

// Export the model
module.exports = User;