const session = require("express-session");
const store = require("better-express-store");

function useSession(app) {
  let salt = "someUnusualStringThatIsUniqueForThisProject";

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
      store: store({ dbPath: "./chat-db.sqlite" }),
    })
  );
}

module.exports = useSession;
