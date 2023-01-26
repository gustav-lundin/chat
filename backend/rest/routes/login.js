const authorizeRequest = require("../../acl/acl.js");
const passwordEncryptor = require("../../util/passwordEncryptor.js");
const express = require("express");
const User = require("../../models/user");

const loginRouter = express.Router();

// loginRouter.all("*", authorizeRequest("login"));

loginRouter.post("/", async (req, res) => {
  const encryptedPassword = passwordEncryptor(req.body.password);
  const user = await User.findOne({
    where: { password: encryptedPassword, email: req.body.email },
  });
  if (user == null) {
    res.status(404).json({ error: "No such user" });
  } else {
    delete user.password;
    req.session.user = user;
    res.json(user);
  }
});

loginRouter.get("/", (req, res) => {
  res.json(req.session.user || { _error: "Not logged in" });
});

loginRouter.delete("/", (req, res) => {
  delete req.session.user;
  res.json({ success: "logged out" });
});

module.exports = loginRouter;
