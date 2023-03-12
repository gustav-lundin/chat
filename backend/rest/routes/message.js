const messageRouter = require("express").Router();
const { getAuthMiddleware } = require("../../acl/acl.js");
const AppError = require("../../apperror.js");
const { Message } = require("../../models/index.js");
const { tryCatch } = require("../../util/trycatch");
const { broadcast } = require("./sse.js");
const { User } = require("../../models/index.js");

const auth = getAuthMiddleware("messages");

messageRouter.post(
  "/:chatId",
  auth,
  tryCatch(async (req, res) => {
    const chatId = req.params.chatId;
    const message = await Message.create({
      content: req.body.content,
      chatId,
      userId: req.session.user.id,
    });
    const messageWithUser = await Message.findByPk(message.id, {
      include: { model: User, attributes: User.dtoKeys() },
    });
    broadcast("new-message", messageWithUser, chatId);
    res.json(message.toJSON());
  })
);

messageRouter.delete(
  "/:messageId",
  auth,
  tryCatch(async (req, res) => {
    const messageId = req.params.messageId;
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
