const Express = require("express");
const userRouter = Express.Router();
const User = require("../../models/user");
const passwordEncryptor = require("../../util/passwordEncryptor");
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
    req.body.password = passwordEncryptor(req.body.password);
    const user = await User.create(req.body);
    res.json(user.dto());
  })
);

module.exports = userRouter;
