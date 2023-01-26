const messageRouter = require("express").Router();
const Message = require("../../models/message");
// const authorizeChatRequest = require("../../acl/chat-acl.js");

// messageRouter.all("*", authorizeChatRequest("messages"));

messageRouter.post("/", (req, res) => {
  Message.create(req.body)
    .then((message) => res.json(message.toJSON()))
    .catch(() => res.send("message creation fail"));
});

module.exports = messageRouter;
