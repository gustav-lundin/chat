const messageRouter = require("express").Router();
const { Message } = require("../../models/index.js");
const { tryCatch } = require("../../util/trycatch");
// const authorizeChatRequest = require("../../acl/chat-acl.js");

// messageRouter.all("*", authorizeChatRequest("messages"));

messageRouter.post(
  "/",
  tryCatch(async (req, res) => {
    const message = await Message.create(req.body);
    res.json(message.toJSON());
  })
);

module.exports = messageRouter;
