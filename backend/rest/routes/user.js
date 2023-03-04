const Express = require("express");
const userRouter = Express.Router();
const { User } = require("../../models/index.js");
const { tryCatch } = require("../../util/trycatch");
const AppError = require("../../apperror");
const { Op } = require("sequelize");
const { getAuthMiddleware } = require("../../acl/acl.js");

const auth = getAuthMiddleware("users");

userRouter.post(
  "/",
  auth,
  tryCatch(async (req, res) => {
    const existingUser = await User.findOne({
      where: { email: req.body.email },
    });
    if (existingUser != null) {
      throw new AppError("User already exists", 400);
    }
    if (req.body.password !== req.body.passwordConfirmation) {
      throw new AppError("Passwords do not match", 400);
    }
    const user = await User.create(req.body);
    res.json(user.dto());
  })
);

userRouter.get(
  "/all",
  auth,
  tryCatch(async (req, res) => {
    const searchQuery = req.query?.search_query;
    const whereOption =
      searchQuery !== undefined
        ? {
            [Op.or]: [
              { firstName: { [Op.like]: `%${searchQuery}%` } },
              { lastName: { [Op.like]: `%${searchQuery}%` } },
              { email: { [Op.like]: `%${searchQuery}%` } },
            ],
          }
        : {};
    const users = await User.findAll({
      where: whereOption,
      attributes: User.dtoKeys(),
    });
    res.json(users);
  })
);

module.exports = userRouter;
