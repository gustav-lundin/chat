const loginRouter = require("./routes/login.js");
const express = require("express");
const router = express.Router();
const authorizeRequest = require("../acl/acl.js");
const userRouter = require("./routes/user");
const chatRouter = require("./routes/chat");
const messageRouter = require("./routes/message");
const chatMemberRouter = require("./routes/chatmember");

router.use("/login", authorizeRequest("login"), loginRouter);
router.use("/users", authorizeRequest("users"), userRouter);
router.use("/chats", authorizeRequest("chats"), chatRouter);
router.use("/messages", authorizeRequest("messages"), messageRouter);
router.use("/chatmembers", authorizeRequest("chatmembers"), chatMemberRouter);

module.exports = router;

// let tablesAndViews = db
//   .prepare(
//     `
//     SELECT name, type
//     FROM sqlite_schema
//     WHERE
//       (type = 'table' OR type = 'view')
//       AND name NOT LIKE 'sqlite_%'
//   `
//   )
//   .all();

// router.get("/tablesAndViews", (req, res) => {
//   authorizeRequest("tablesAndViews")(req, res);
//   if (res.headersSent) {
//     return;
//   }
//   res.json(tablesAndViews);
// });

// for (let { name, type } of tablesAndViews) {
//   router.get("/" + name, (req, res) => {
//     runQuery(
//       name,
//       req,
//       res,
//       {},
//       `
//         SELECT *
//         FROM ${name}
//       `
//     );
//   });

//   router.get("/" + name + "/:id", (req, res) => {
//     runQuery(
//       name,
//       req,
//       res,
//       req.params,
//       `
//         SELECT *
//         FROM ${name}
//         WHERE id = :id
//       `,
//       true
//     );
//   });

//   if (type === "view") {
//     continue;
//   }

//   router.post("/" + name, (req, res) => {
//     delete req.body.id;

//     if (name === userTable) {
//       req.body[userRoleField] = "user";
//       req.body[passwordField] = passwordEncryptor(req.body[passwordField]);
//     }

//     runQuery(
//       name,
//       req,
//       res,
//       req.body,
//       `
//         INSERT INTO ${name} (${Object.keys(req.body)})
//         VALUES (${Object.keys(req.body).map((x) => ":" + x)})
//       `
//     );
//   });

//   let putAndPatch = (req, res) => {
//     if (name === userTable && req.body[passwordField]) {
//       req.body[passwordField] = passwordEncryptor(req.body[passwordField]);
//     }

//     runQuery(
//       name,
//       req,
//       res,
//       { ...req.body, ...req.params },
//       `
//         UPDATE ${name}
//         SET ${Object.keys(req.body).map((x) => x + " = :" + x)}
//         WHERE id = :id
//       `
//     );
//   };

//   router.put("/" + name + "/:id", putAndPatch);
//   router.patch("/" + name + "/:id", putAndPatch);

//   router.delete("/" + name + "/:id", (req, res) => {
//     runQuery(
//       name,
//       req,
//       res,
//       req.params,
//       `
//         DELETE FROM ${name}
//         WHERE id = :id
//       `
//     );
//   });
// }

// router.all("/*", (req, res) => {
//   res.status(404);
//   res.json({ _error: "No such route!" });
// });

// router.use((error, req, res, next) => {
//   if (error) {
//     let result = {
//       _error: error + "",
//     };
//     res.json(result);
//   } else {
//     next();
//   }
// });

// function runQuery(
//   tableName,
//   req,
//   res,
//   parameters,
//   sqlForPreparedStatement,
//   onlyOne = false
// ) {
//   authorizeRequest(tableName)(req, res);
//   if (res.headersSent) {
//     return;
//   }

//   let result;
//   try {
//     let stmt = db.prepare(sqlForPreparedStatement);
//     let method =
//       sqlForPreparedStatement.trim().toLowerCase().indexOf("select") === 0
//         ? "all"
//         : "run";
//     result = stmt[method](parameters);
//   } catch (error) {
//     result = { _error: error + "" };
//   }
//   if (onlyOne) {
//     result = result[0];
//   }
//   result = result || null;
//   res.status(result ? (result._error ? 500 : 200) : 404);
//   setTimeout(() => res.json(result), 1);
// }
