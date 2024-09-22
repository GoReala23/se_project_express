const { NODE_ENV, JWT_SECRET = "super-strong-seceret" } = process.env;

module.exports = {
  JWT_SECRET: NODE_ENV === "production" ? JWT_SECRET : "super-strong-seceret",
};
