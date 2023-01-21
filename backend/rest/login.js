const acl = require("../acl/acl.js");
const passwordEncryptor = require("../util/passwordEncryptor.js");

module.exports = function (app, db) {
  app.post("/api/login", (req, res) => {
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

  app.get("/api/login", (req, res) => {
    if (!acl("login", req)) {
      res.status(405);
      res.json({ _error: "Not allowed" });
    }
    res.json(req.session.user || { _error: "Not logged in" });
  });

  app.delete("/api/login", (req, res) => {
    if (!acl("login", req)) {
      res.status(405);
      res.json({ _error: "Not allowed" });
    }
    delete req.session.user;
    res.json({ success: "logged out" });
  });
};
