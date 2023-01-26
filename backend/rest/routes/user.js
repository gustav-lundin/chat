const Express = require("express");
const userRouter = Express.Router();
const User = require("../../models/user");
const passwordEncryptor = require("../../util/passwordEncryptor");

userRouter.post("/", (req, res) => {
  User.findOne({ where: { email: req.body.email } }).then((user) => {
    if (user) res.status(500).json({ error: "User already exists" });
  });
  req.body.password = passwordEncryptor(req.body.password);
  User.create(req.body)
    .then((user) => res.json(user.toJSON()))
    .catch(() => res.send("user creation fail"));
});

module.exports = userRouter;
