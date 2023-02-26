const Express = require("express");
const userRouter = Express.Router();
const { User } = require("../../models/index.js");
const { tryCatch } = require("../../util/trycatch");
const AppError = require("../../apperror");
const { Chat } = require("../../models/index.js");

userRouter.post(
  "/",
  tryCatch(async (req, res) => {
    const existingUser = await User.findOne({
      where: { email: req.body.email },
    });
    if (existingUser != null) {
      throw new AppError("User already exists", 400);
    }
    if (req.body.password !== req.body.passwordConfirmation) {
      throw new AppError("Passwords do not match", 400);
    }
    const user = await User.create(req.body);
    res.json(user.dto());
  })
);

userRouter.get(
  "/test",
  tryCatch(async (req, res) => {
    const user = await User.findByPk(1, { include: Chat });
    res.json(user);
  })
);

module.exports = userRouter;
