const passwordEncryptor = require("../util/passwordEncryptor.js");
const acl = require("../acl/acl.js");
const login = require("./routes/login.js");
const express = require("express");
const router = express.Router();
const db = require("better-sqlite3")("chat-app.db");
const userTable = "users";
const passwordField = "password";
const userRoleField = "userRole";

router.use("/login", login);

let tablesAndViews = db
  .prepare(
    `
    SELECT name, type 
    FROM sqlite_schema
    WHERE 
      (type = 'table' OR type = 'view') 
      AND name NOT LIKE 'sqlite_%'
  `
  )
  .all();

router.get("/tablesAndViews", (req, res) => {
  if (!acl("tablesAndViews", req)) {
    res.status(405);
    res.json({ _error: "Not allowed!" });
    return;
  }
  res.json(tablesAndViews);
});

for (let { name, type } of tablesAndViews) {
  router.get("/" + name, (req, res) => {
    runQuery(
      name,
      req,
      res,
      {},
      `
        SELECT *
        FROM ${name}
      `
    );
  });

  router.get("/" + name + "/:id", (req, res) => {
    runQuery(
      name,
      req,
      res,
      req.params,
      `
        SELECT *
        FROM ${name}
        WHERE id = :id
      `,
      true
    );
  });

  if (type === "view") {
    continue;
  }

  router.post("/" + name, (req, res) => {
    delete req.body.id;

    if (name === userTable) {
      req.body[userRoleField] = "user";
      req.body[passwordField] = passwordEncryptor(req.body[passwordField]);
    }

    runQuery(
      name,
      req,
      res,
      req.body,
      `
        INSERT INTO ${name} (${Object.keys(req.body)})
        VALUES (${Object.keys(req.body).map((x) => ":" + x)})
      `
    );
  });

  let putAndPatch = (req, res) => {
    if (name === userTable && req.body[passwordField]) {
      req.body[passwordField] = passwordEncryptor(req.body[passwordField]);
    }

    runQuery(
      name,
      req,
      res,
      { ...req.body, ...req.params },
      `
        UPDATE ${name}
        SET ${Object.keys(req.body).map((x) => x + " = :" + x)}
        WHERE id = :id
      `
    );
  };

  router.put("/" + name + "/:id", putAndPatch);
  router.patch("/" + name + "/:id", putAndPatch);

  router.delete("/" + name + "/:id", (req, res) => {
    runQuery(
      name,
      req,
      res,
      req.params,
      `
        DELETE FROM ${name}
        WHERE id = :id
      `
    );
  });
}

router.all("/*", (req, res) => {
  res.status(404);
  res.json({ _error: "No such route!" });
});

router.use((error, req, res, next) => {
  if (error) {
    let result = {
      _error: error + "",
    };
    res.json(result);
  } else {
    next();
  }
});

function runQuery(
  tableName,
  req,
  res,
  parameters,
  sqlForPreparedStatement,
  onlyOne = false
) {
  if (!acl(tableName, req)) {
    res.status(405);
    res.json({ _error: "Not allowed!" });
    return;
  }

  let result;
  try {
    let stmt = db.prepare(sqlForPreparedStatement);
    let method =
      sqlForPreparedStatement.trim().toLowerCase().indexOf("select") === 0
        ? "all"
        : "run";
    result = stmt[method](parameters);
  } catch (error) {
    result = { _error: error + "" };
  }
  if (onlyOne) {
    result = result[0];
  }
  result = result || null;
  res.status(result ? (result._error ? 500 : 200) : 404);
  setTimeout(() => res.json(result), 1);
}

module.exports = router;
