const AppError = require("../apperror");

const errorHandler = (error, req, res, next) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({ error: error.message });
  }

  // catch validation errors

  // return res.status(500).json({ error: "Something went wrong" });
  throw error;
};

module.exports = errorHandler;
