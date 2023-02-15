const express = require("express");
const app = express();
const sequelize = require("./sequelize");
const { router } = require("./rest/index");
const errorHandler = require("./middleware/errorhandler");
const AppError = require("./apperror");
const useSession = require("./middleware/sessionhandler");

const port = process.env.port || 4000;

sequelize
  .sync({ force: true })
  .then(() => console.log("database created"))
  .catch(() => console.log("database creation failed"));

app.use(express.json({ limit: "100MB" }));

app.listen(port, () => console.log("Listening on http://localhost:" + port));

useSession(app);
app.use("/api", router);
app.use("*", (req, res) => {
  throw new AppError("Not found", 404);
});
app.use("*", errorHandler);
