const chatMemberRouter = require("express").Router();
const { getAuthMiddleware } = require("../../acl/acl.js");
const AppError = require("../../apperror.js");
const { ChatMember } = require("../../models/index.js");
const { tryCatch } = require("../../util/trycatch");

const auth = getAuthMiddleware("chatmembers");

chatMemberRouter.post(
  "/:chatId/:userId",
  auth,
  tryCatch(async (req, res) => {
    const chatId = req.params.chatId;
    const userId = req.params.userId;
    const existingChatMember = await ChatMember.findOne({
      where: { chatId, userId },
    });
    if (existingChatMember) {
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
  "/:chatId/:userId",
  auth,
  tryCatch(async (req, res) => {
    const chatId = req.params.chatId;
    const userId = req.params.userId;
    if (!(chatId && userId)) {
      throw new AppError("No id provided", 404);
    }
    const chatMember = await ChatMember.findOne({ where: { chatId, userId } });
    if (!chatMember) {
      throw new AppError("No such chat member", 404);
    }
    if (Object.keys(req.body).includes("inviteAccepted")) {
      if (req.session.user.id != userId || !req.body.inviteAccepted) {
        console.log(req.session.user.id, userId);
        throw new AppError("Not allowed", 403);
      }
      await chatMember.update({
        inviteAccepted: req.body.inviteAccepted,
      });
      await chatMember.save();
    } else if (Object.keys(req.body).includes("blocked")) {
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
      await chatMember.update({ blocked: req.body.blocked });
      await chatMember.save();
    }
    res.json(chatMember);
  })
);

module.exports = chatMemberRouter;
