const express = require("express");
const chatRouter = express.Router();
const { Chat, ChatMember, Message, User } = require("../../models/index.js");
const { tryCatch } = require("../../util/trycatch");

chatRouter.post(
  "/",
  tryCatch(async (req, res) => {
    const userId = 1; //req.session.user.id
    const chat = await Chat.create({ name: req.body.name });
    const creator = await ChatMember.create({
      userId: userId,
      chatId: chat.id,
      inviteAccepted: true,
      blocked: false,
      creator: true,
    });
    res.json({ chat, creator });
  })
);

chatRouter.get(
  "/all",
  tryCatch(async (req, res, next) => {
    const userId = 1; //req.session.user.id;
    const orderBy = req.query?.orderby;
    const order = [["chatMessages", "createdAt", "DESC"]];
    if (orderBy === "name") {
      order.unshift(["name"]);
    }
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
        },
      ],
      order,
    });
    if (orderBy === "chatactivity") {
      memberChats.sort((a, b) => {
        if (a.chatMessages.length === 0 && b.chatMessages === 0) {
          return 0;
        } else if (a.chatMessages.length === 0) {
          return 1;
        } else if (b.chatMessages.length === 0) {
          return -1;
        } else {
          const lastMessageDateA = new Date(a.chatMessages[0].createdAt);
          const lastMessageDateB = new Date(b.chatMessages[0].createdAt);
          return lastMessageDateB - lastMessageDateA;
        }
      });
    } else if (orderBy === "useractivity") {
      memberChats.sort((a, b) => {
        const lastUserMessageA = a.chatMessages.find(
          (message) => message.userId === userId
        );
        const lastUserMessageB = b.chatMessages.find(
          (message) => message.userId === userId
        );
        if (lastUserMessageA === undefined && lastUserMessageB === undefined) {
          return 0;
        } else if (lastUserMessageA === undefined) {
          return 1;
        } else if (lastUserMessageB === undefined) {
          return -1;
        } else {
          const lastUserMessageDateA = new Date(lastUserMessageA.createdAt);
          const lastUserMessageDateB = new Date(lastUserMessageB.createdAt);
          return lastUserMessageDateB - lastUserMessageDateA;
        }
      });
    }

    const invited = [];
    const blocked = [];
    const active = [];
    for (const chat of memberChats) {
      const chatMember = chat.chatMembers[0].ChatMember;
      if (chatMember.blocked) {
        blocked.push(chat);
      } else if (!chatMember.inviteAccepted) {
        invited.push(chat);
      } else {
        active.push(chat);
      }
    }
    res.json({ active, invited, blocked });
  })
);

chatRouter.get(
  "/:chatId",
  tryCatch(async (req, res, next) => {
    const order = [["chatMessages", "createdAt", "DESC"]];
    const chat = await Chat.findByPk(req.params.chatId, {
      include: [
        { model: User, as: "chatMembers", attributes: User.dtoKeys() },
        {
          model: Message,
          as: "chatMessages",
          include: { model: User, attributes: User.dtoKeys() },
        },
      ],
      order,
    });
    res.json({ chat });
  })
);

module.exports = chatRouter;
