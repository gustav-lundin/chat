const chatMemberRouter = require("express").Router();
const ChatMember = require("../../models/chatmember");
const { tryCatch } = require("../../util/trycatch");

chatMemberRouter.post(
  "/",
  tryCatch(async (req, res) => {
    const chatMember = await ChatMember.create(req.body);
    res.json(chatMember.toJSON());
  })
);

chatMemberRouter.get("/:chatId", (req, res) => {});

module.exports = chatMemberRouter;
