const jwt = require('jsonwebtoken');
const User = require('../models/user');

async function validateRequest(req, res, next) {
  const authToken = req.headers["Authorization"] || req.headers.authorization;

  // if the header is not present
   if (!authToken || !authToken.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Token missing", data: {} });
  }

  // Remove "Bearer " prefix
  const token = authToken.split(" ")[1];

  let userToken = null;
  try {
    userToken = jwt.verify(token, process.env.JWT_SECRET);
    res.user = userToken;

    req.user = await User.findById(userToken.id).select('_id email role appPermissions');
    next();
  } catch (err) {
    return res
      .status(401)
      .send({ success: false, message: err?.message, data: err });
  }
}

// Middleware to check if user is admin
function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "User not authenticated", data: {} });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: "Access denied. Admin role required.", data: {} });
  }

  next();
}

// Middleware to check if user has permission for a specific app
function requirePermission(appName) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "User not authenticated", data: {} });
    }

    // Admin has access to all apps
    if (req.user.role === 'admin') {
      return next();
    }

    // Check if member has the required permission
    if (!req.user.appPermissions || !req.user.appPermissions.includes(appName)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. '${appName}' permission required.`,
        data: {}
      });
    }

    next();
  };
}

module.exports = {
    validateRequest,
    requireAdmin,
    requirePermission
}