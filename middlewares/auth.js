const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
// const ERROR_CODES = require("../utils/errors");
const UnauthoizeError = require("../errors/UnauthorizedError");

// Middleware to authenticate the JWT token and set the user in the request object

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(new UnauthoizeError("Authorization required"));
  }

  const token = authorization.replace("Bearer ", "");

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    return next();
  } catch (err) {
    return next(new UnauthoizeError("Authorization required"));
  }
};

module.exports = auth;
