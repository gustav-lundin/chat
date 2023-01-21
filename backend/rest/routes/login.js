const authorizeRequest = require("../../acl/acl.js");
const passwordEncryptor = require("../../util/passwordEncryptor.js");
const express = require("express");

const loginRouter = (db) => {
  const router = express.Router();

  router.all("*", authorizeRequest("login"));

  router.post("/", (req, res) => {
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
    res.json(req.session.user || { _error: "Not logged in" });
  });

  router.delete("/", (req, res) => {
    delete req.session.user;
    res.json({ success: "logged out" });
  });

  return router;
};

module.exports = loginRouter;
