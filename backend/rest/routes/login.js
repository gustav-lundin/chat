const acl = require("../../acl/acl.js");
const passwordEncryptor = require("../../util/passwordEncryptor.js");
const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  if (!acl("login", req)) {
    res.status(405);
    res.json({ _error: "Not allowed" });
  }
  req.body.password = passwordEncryptor(req.body[passwordField]);
  let stmt = db.prepare(`
      SELECT * FROM customers
      WHERE email = :email AND password = :password
    `);
  let result = stmt.all(req.body)[0] || { _error: "No such user." };
  delete result.password;
  if (!result._error) {
    req.session.user = result;
  }
  res.json(result);
});

router.get("/", (req, res) => {
  if (!acl("login", req)) {
    res.status(405);
    res.json({ _error: "Not allowed" });
  }
  res.json(req.session.user || { _error: "Not logged in" });
});

router.delete("/", (req, res) => {
  if (!acl("login", req)) {
    res.status(405);
    res.json({ _error: "Not allowed" });
  }
  delete req.session.user;
  res.json({ success: "logged out" });
});

module.exports = router;
