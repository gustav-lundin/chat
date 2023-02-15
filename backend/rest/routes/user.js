const Express = require("express");
const userRouter = Express.Router();
const User = require("../../models/user");
const { tryCatch } = require("../../util/trycatch");
const AppError = require("../../apperror");

userRouter.post(
  "/",
  tryCatch(async (req, res) => {
    const existingUser = await User.findOne({
      where: { email: req.body.email },
    });
    if (existingUser != null) {
      throw new AppError("User already exists", 400);
    }
    if (req.body.password != req.body.passwordConfirmation) {
      throw new AppError("Passwords do not match", 400);
    }
    const user = await User.create(req.body);
    res.json(user.dto());
  })
);

module.exports = userRouter;
