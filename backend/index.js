const express = require("express");
const db = require("better-sqlite3")("chat-app.db");
const session = require("express-session");
const store = require("better-express-store");
const app = express();
const router = require("./rest/rest-api");

const port = process.env.port || 4000;

app.use(express.json({ limit: "100MB" }));

app.listen(port, () => console.log("Listening on http://localhost:" + port));

useSession(app);
app.use("/api", router);

// FIXME: solve unknown url on frontend?

function useSession() {
  // salt for cookie hash generation
  let salt = "someUnusualStringThatIsUniqueForThisProject";

  // if we are running in production mode and no password salt or short password salt exit
  if (process.env.PRODUCTION) {
    if (!process.env.COOKIE_SALT) {
      console.log(
        "Shutting down, in production and missing env. variable COOKIE_SALT"
      );
      process.exit();
    } else if (process.env.COOKIE_SALT.length < 32) {
      console.log("Shutting down, env. variable COOKIE_SALT too short.");
      process.exit();
    } else {
      salt = process.env.COOKIE_SALT;
    }
  }

  app.use(
    session({
      secret: salt,
      resave: false,
      saveUninitialized: true,
      cookie: { secure: "auto" },
      store: store({ dbPath: "./chat-app.db" }),
    })
  );
}

// DELETE ME
app.get("/api/test", (req, res) => {
  run(res, `SELECT * FROM users`, {}, "all");
});

function run(res, query, params, type = "run") {
  res.json(db.prepare(query)[type](params));
}
