const chatMemberRouter = require("express").Router();
const ChatMember = require("../../models/chatmember");
const authorizeRequest = require("../../acl/acl");
const { tryCatch } = require("../../util/trycatch");

chatMemberRouter.all("*", authorizeRequest("chatmembers"));

chatMemberRouter.post(
  "/",
  tryCatch(async (req, res) => {
    const chatMember = await ChatMember.create(req.body);
    res.json(chatMember.toJSON());
  })
);

module.exports = chatMemberRouter;
