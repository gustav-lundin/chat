const AppError = require("../apperror");

const errorHandler = (error, req, res, next) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({ error: error.message });
  }

  return res.status(500).json({ error: "Something went wrong" });
};

module.exports = errorHandler;
