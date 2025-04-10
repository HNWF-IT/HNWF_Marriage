const jwt = require('jsonwebtoken');

function validateRequest(req, res, next) {
  const authorizationData = req.headers["Authorization"] || req.headers.authorization;
  const token = authorizationData
  .split('; ')
  .find(row => row.startsWith('token='))
  ?.split('=')[1];

  // if the header is not present
  if (!token) {
    return res.status(401).json({ success: false, message: "Token missing", data: {} });
  }

  let userToken = null;
  try {
    userToken = jwt.verify(token, process.env.JWT_SECRET);
    res.user = userToken;
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