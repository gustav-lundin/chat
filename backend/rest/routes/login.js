const { encryptPassword } = require("../../util/password.js");
const express = require("express");
const { User } = require("../../models/index.js");
const { tryCatch } = require("../../util/trycatch.js");
const AppError = require("../../apperror");
const { getAuthMiddleware } = require("../../acl/acl.js");
const loginRouter = express.Router();

const auth = getAuthMiddleware("login");

loginRouter.post(
  "/",
  auth,
  tryCatch(async (req, res) => {
    const encryptedPassword = encryptPassword(req.body.password);
    const user = await User.findOne({
      where: { password: encryptedPassword, email: req.body.email },
    });
    if (user == null) {
      const existingUser = await User.findOne({
        where: { email: req.body.email },
      });
      if (existingUser) {
        throw new AppError("Incorrect password", 400);
      }
      throw new AppError("Incorrect email", 400);
    }
    const dto = user.dto();
    req.session.user = dto;
    res.json(dto);
  })
);

loginRouter.get(
  "/",
  auth,
  tryCatch((req, res) => {
    if (req.session.user) {
      res.json(req.session.user);
    } else {
      throw new AppError("Not logged in", 400);
    }
  })
);

loginRouter.delete("/", auth, (req, res) => {
  req.session.user = undefined;
  res.json({ success: "logged out" });
});

module.exports = loginRouter;
