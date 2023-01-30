const express = require("express");
const chatRouter = express.Router();
const Chat = require("../../models/chat");
const { tryCatch } = require("../../util/trycatch");

chatRouter.post(
  "/",
  tryCatch(async (req, res) => {
    const chat = await Chat.create(req.body);
    res.json(chat);
  })
);

module.exports = chatRouter;
