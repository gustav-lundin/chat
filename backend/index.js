const express = require("express");
const db = require("better-sqlite3")("chat-app.db");

const app = express();
const port = 4000;

app.use(express.json());

// example stub for rest api
app.get("/api/fun", (req, res) => {
  res.json({ fun: "So much fun" });
});

app.get("/api/test", (req, res) => {
  run(res, `SELECT * FROM users`, {}, "all");
});

function run(res, query, params, type = "run") {
  res.json(db.prepare(query)[type](params));
}

app.listen(port, () => console.log("Listening on http://localhost:" + port));
