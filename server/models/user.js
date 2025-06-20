const mongoose = require("mongoose");

// Define the user schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  status: {
    type: Boolean,
    required: true
  },
  phoneNo: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'user', 'member'],
    required: true
  },
  appPermission: {
    type: [String],
    enum: ['marriage', 'library'],
    default: []
  }
});

// Create the model from the schema
const User = mongoose.model('User', userSchema);

// Export the model
module.exports = User;