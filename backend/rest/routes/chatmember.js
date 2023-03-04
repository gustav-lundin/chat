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
    chatMember.update(req.body);
    await chatMember.save();
    res.json(chatMember);
  })
);

module.exports = chatMemberRouter;
