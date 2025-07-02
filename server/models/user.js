// models/user.js
const mongoose = require("mongoose");
const { APP_PERMISSIONS } = require("../utils/constants");

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
  appPermissions: {
    type: [{
      type: String,
      enum: APP_PERMISSIONS
    }],
    default: []
  }
});

module.exports = mongoose.model('User', userSchema);
