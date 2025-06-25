// models/user.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    select: false  // ⬅ always exclude unless explicitly selected
  },
  status: {
    type: Boolean,
    default: true
  },
  phoneNo: {
    type: String,
    required: true
  },
  fullname: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'member'],
    required: true
  },
  appPermission: {
    type: [String],
    default: []
  }
});

module.exports = mongoose.model('User', userSchema);
