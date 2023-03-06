const express = require("express");
const app = express();
const sequelize = require("./sequelize");
const { router } = require("./rest/index");
const errorHandler = require("./middleware/errorhandler");
const AppError = require("./apperror");
const useSession = require("./middleware/sessionhandler");
const seeder = require("./seeder/seeder.js");

const port = process.env.port || 4000;

// const syncDb =
const syncDb = async () => {
  await sequelize
    .sync({ force: true })
    .then(() => console.log("database created"))
    .catch(() => console.log("database creation failed"));
};

(async () => {
  await syncDb();
  await seeder();
})();

app.use(express.json({ limit: "100MB" }));

useSession(app);
app.use((error, req, res, next) => {
  if (error) {
    throw new AppError("Something went wrong with your JSON", 400);
  } else {
    next();
  }
});
app.use("*", (req, res, next) => {
  const data = Object.entries(req.body);
  for (let [key, value] of data) {
    if (typeof value === "string") {
      value = value.replace(/</g, "&lt;");
      value = value.replace(/>/g, "&gt;");
    }
    data[key] = value;
  }
  req.body = data;
  next();
});
app.use("/api", router);
app.use("*", (req, res) => {
  throw new AppError("Not found", 404);
});
app.use("*", errorHandler);

app.listen(port, () => console.log(`Listening on http://localhost: ${port}`));
