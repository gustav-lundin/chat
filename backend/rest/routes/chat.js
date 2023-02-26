const express = require("express");
const chatRouter = express.Router();
const { Chat } = require("../../models/index.js");
const { tryCatch } = require("../../util/trycatch");
const { User } = require("../../models/index.js");
const { Message } = require("../../models/index.js");

chatRouter.post(
  "/",
  tryCatch(async (req, res) => {
    const chat = await Chat.create(req.body);
    res.json(chat);
  })
);

chatRouter.get(
  "/all",
  tryCatch(async (req, res, next) => {
    const userId = 1;
    const created = await Chat.findAll({
      include: [
        {
          model: User,
          as: "creator",
          attributes: User.dtoKeys(),
          where: { id: userId },
        },
        {
          model: Message,
          as: "chatMessages",
          // include: { model: User, attributes: User.dtoKeys() },
          // order: [["chatMessages", "createdAt", "DESC"]],
        },
      ],
      order: [["chatMessages", "createdAt", "DESC"]],
    });
    // res.json(created);
    const memberChats = await Chat.findAll({
      include: [
        {
          model: User,
          as: "chatMembers",
          attributes: User.dtoKeys(),
          where: { id: userId },
        },
        {
          model: Message,
          as: "chatMessages",
          // include: { model: User, attributes: User.dtoKeys() },
        },
      ],
      order: [["chatMessages", "createdAt", "DESC"]],
    });
    const invited = [];
    const blocked = [];
    const joined = [];
    for (const chat of memberChats) {
      const chatMember = chat.chatMembers[0].ChatMember;
      if (chatMember.blocked) {
        blocked.push(chat);
      } else if (!chatMember.inviteAccepted) {
        invited.push(chat);
      } else {
        joined.push(chat);
      }
    }
    res.json({ created, joined, invited, blocked });
  })
);

chatRouter.get(
  "/:chatId",
  tryCatch(async (req, res, next) => {
    const chat = await Chat.findByPk(req.params.chatId, {
      include: [
        { model: User, as: "creator", attributes: User.dtoKeys() },
        { model: User, as: "chatMembers", attributes: User.dtoKeys() },
        {
          model: Message,
          as: "chatMessages",
          include: { model: User, attributes: User.dtoKeys() },
        },
      ],
    });
    res.json({ chat });
  })
);

module.exports = chatRouter;
