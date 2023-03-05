const AppError = require("./apperror");

function validateString(value) {
  if (typeof value !== "string") {
    throw new AppError("Invalid type", 400);
  }
}

exports.validateString = validateString;
