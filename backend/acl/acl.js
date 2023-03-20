const aclRules = require("./acl-rules.json");
const { Chat } = require("../models/index.js");
const { ChatMember } = require("../models/index.js");
const AppError = require("../apperror");

const getAuthMiddleware = (route) => {
  return async (req, res, next) => {
    try {
      const isAdmin = req.session.user.userRole === "admin";
      if ((req.params.chatId || req.body.chatId) && !isAdmin) {
        await authorizeChatRequest(
          req,
          res,
          next,
          route,
          req.params.chatId ?? req.body.chatId
        );
      } else {
        let method = req.method.toLowerCase();
        method = method === "patch" ? "put" : method;
        let userRole = req.session?.user
          ? req.session.user.userRole
          : "visitor";
        let allowed = !!aclRules?.[userRole]?.[route]?.[method];
        if (!allowed) {
          throw new AppError("Access denied", 403);
        }
        console.log("req authorized");
        next();
      }
    } catch (e) {
      next(e);
    }
  };
};

async function authorizeChatRequest(req, _res, next, route, chatId) {
  let method = req.method.toLowerCase();
  method = method === "patch" ? "put" : method;
  if (!req.session?.user) {
    throw new AppError("Login required", 403);
  }
  const chat = await Chat.findByPk(chatId);
  if (chat === null) {
    throw new AppError("Chat not found", 404);
  }
  let chatUserRole;
  if (req.session.user.userRole === aclRules.userRoles.admin) {
    chatUserRole = aclRules.userChatRoles.chatAdmin;
  } else {
    const chatMember = await ChatMember.findOne({
      where: { chatId: chat.id, userId: req.session.user.id },
    });
    if (chatMember == null) {
      throw new AppError("Only accessible for chat members", 403);
    }
    if (
      !chatMember.inviteAccepted &&
      route !== "chatmembers" &&
      method !== "put"
    ) {
      throw new AppError("Invite not accepted", 405);
    }
    if (chatMember.blocked) {
      throw new AppError("You have been blocked", 403);
    }
    chatUserRole = chatMember.creator
      ? aclRules.userChatRoles.chatAdmin
      : aclRules.userChatRoles.chatMember;
  }
  let allowed = aclRules.user.userChatRoles?.[chatUserRole]?.[route]?.[method];
  if (!allowed) {
    throw new AppError("Access denied", 403);
  }
  console.log("chat req authorized");
  next();
}

exports.getAuthMiddleware = getAuthMiddleware;
