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

    req.user = await User.findById(userToken.id).select('_id email');
    next();
  } catch (err) {
    return res
      .status(401)
      .send({ success: false, message: err?.message, data: err });
  }
}

module.exports = {
    validateRequest
}