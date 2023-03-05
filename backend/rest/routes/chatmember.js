const chatMemberRouter = require("express").Router();
const { getAuthMiddleware } = require("../../acl/acl.js");
const AppError = require("../../apperror.js");
const { ChatMember, User } = require("../../models/index.js");
const { tryCatch } = require("../../util/trycatch");

const auth = getAuthMiddleware("chatmembers");

chatMemberRouter.post(
  "/:chatId/:userId",
  auth,
  tryCatch(async (req, res) => {
    const chatId = req.params.chatId;
    const userId = req.params.userId;
    const user = await User.findByPk(userId);
    if (user == null) {
      throw new AppError("No such user", 400);
    }
    const existingChatMember = await ChatMember.findOne({
      where: { chatId, userId },
    });
    if (existingChatMember != null) {
      throw new AppError("User already invited", 405);
    }
    const chatMember = await ChatMember.create({
      chatId,
      userId,
      inviteAccepted: false,
      blocked: false,
      creator: false,
    });
    res.json(chatMember.toJSON());
  })
);

chatMemberRouter.put(
  "/block/:chatId/:userId",
  auth,
  tryCatch(async (req, res) => {
    const chatMember = await ChatMember.findOne({ where: { chatId, userId } });
    if (!chatMember) {
      throw new AppError("No such chat member", 404);
    }
    if (req.session.user.id == userId) {
      throw new AppError("Not allowed", 403);
    }
    if (req.session.user.userRole !== "admin") {
      const userChatMember = await ChatMember.findOne({
        where: { chatId, userId: req.session.user.id },
      });
      if (userChatMember == null || !userChatMember.creator) {
        throw new AppError("Not allowed", 403);
      }
    }
    await chatMember.update({ blocked: !chatMember.blocked });
    await chatMember.save();
    res.json(chatMember);
  })
);

chatMemberRouter.put(
  "/accept/:chatId",
  auth,
  tryCatch(async (req, res) => {
    const chatId = req.params.chatId;
    const chatMember = await ChatMember.findOne({
      where: { chatId, userId: req.session.user.id },
    });
    if (!chatMember) {
      throw new AppError("No such chat member", 404);
    }
    if (chatMember.inviteAccepted) {
      throw new AppError("Invite already accepted", 400);
    }
    await chatMember.update({
      inviteAccepted: true,
    });
    await chatMember.save();
    res.json(chatMember);
  })
);

module.exports = chatMemberRouter;
