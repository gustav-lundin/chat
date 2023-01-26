const chatMemberRouter = require("express").Router();
const ChatMember = require("../../models/chatmember");
const authorizeRequest = require("../../acl/acl");

chatMemberRouter.all("*", authorizeRequest("chatmembers"));

chatMemberRouter.post("/", (req, res) => {
  ChatMember.create(req.body)
    .then((chatMember) => res.json(chatMember.toJSON()))
    .catch(() => res.send("chatmember creation failed"));
});

module.exports = chatMemberRouter;
