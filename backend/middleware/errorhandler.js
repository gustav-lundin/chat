const AppError = require("../apperror.js");
const { ValidationError } = require("sequelize");

const errorHandler = (error, req, res, next) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({ error: error.message });
  }

  if (error instanceof ValidationError) {
    res.status(400).json({ error: error.message });
  }
  return res.status(500).json({ error: "Something went wrong" });
  // throw error;
};

module.exports = errorHandler;
