const messageRouter = require("express").Router();
const { getAuthMiddleware } = require("../../acl/acl.js");
const AppError = require("../../apperror.js");
const { Message } = require("../../models/index.js");
const { tryCatch } = require("../../util/trycatch");

const auth = getAuthMiddleware("messages");

messageRouter.post(
  "/:chatId",
  auth,
  tryCatch(async (req, res) => {
    if (req.body.userId !== req.session.user.id) {
      throw new AppError("Not allowed", 405);
    }
    const message = await Message.create(req.body);
    res.json(message.toJSON());
  })
);

messageRouter.delete(
  "/:messageId",
  auth,
  tryCatch(async (req, res) => {
    const messageId = req.params.messageId;
    if (!messageId) {
      throw new AppError("No message id provided", 404);
    }
    const message = await Message.findByPk(messageId);
    if (!message) {
      throw new AppError("Message not found", 404);
    } else {
      await message.destroy();
      res.json({ status: "ok" });
    }
  })
);

module.exports = messageRouter;
