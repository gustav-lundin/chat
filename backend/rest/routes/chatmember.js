const chatMemberRouter = require("express").Router();
const AppError = require("../../apperror.js");
const { ChatMember } = require("../../models/index.js");
const { tryCatch } = require("../../util/trycatch");

chatMemberRouter.post(
  "/:chatId/:userId",
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
  tryCatch(async (req, res) => {
    const chatId = req.params.chatId;
    const userId = req.params.userId;
    if (!(chatId && userId)) {
      console.log("no");
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
