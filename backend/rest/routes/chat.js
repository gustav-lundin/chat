const express = require("express");
const chatRouter = express.Router();
const Chat = require("../../models/chat");
// const authorizeChatRequest = require("../../acl/chat-acl.js");

// chatRouter.all("*", authorizeChatRequest("chats"));

chatRouter.post("/", (req, res) => {
  Chat.create(req.body)
    .then((chat) => res.json(chat.toJSON()))
    .catch(() => res.status(500).send("Chat creation failed"));
});

module.exports = chatRouter;
