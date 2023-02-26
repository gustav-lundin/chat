const aclRules = require("./acl-rules.json");
const { Chat } = require("../models/index.js");
const { ChatMember } = require("../models/index.js");
const AppError = require("../apperror");

const getAuthMiddleware = (route) => {
  return async (req, _res, next) => {
    console.log("authentication turned off");
    next();
    return;
    try {
      let method = req.method.toLowerCase();
      method = method === "patch" ? "put" : method;
      if (req.params.chatId && req.session.user.userRole !== "admin") {
        await authorizeChatRequest(route, req, method);
      } else {
        authorizeRequest(route, req, method);
      }
      next();
    } catch (e) {
      next(e);
    }
  };
};

function authorizeRequest(route, req, method) {
  let userRole = req.session?.user ? req.session.user.userRole : "visitor";
  let allowed = !!aclRules?.[userRole]?.[route]?.[method];
  if (!allowed) {
    throw new AppError("Access denied", 403);
  }
}

async function authorizeChatRequest(route, req, method) {
  try {
    if (!req.session.user) {
      throw new AppError("Access denied", 403);
    } else if (req.session.userRole === aclRules.userRoles.admin) {
      return;
    }
    const chat = await Chat.findByPk(req.params.chatId);
    if (chat === null) {
      throw new AppError("Chat not found", 404);
    }
    let chatUserRole;
    if (chat.userId === req.session.user.id) {
      chatUserRole = aclRules.userChatRoles.chatAdmin;
    } else {
      const chatMember = await ChatMember.findOne({
        where: { chatId: chat.id, userId: req.session.user.id },
      });
      if (chatMember == null || !chatMember.inviteAccepted) {
        throw new AppError("Access denied", 403);
      }
      chatUserRole = aclRules.userChatRoles.chatMember;
    }
    let allowed = user.userChatRoles?.[chatUserRole]?.[route]?.[method];
    if (!allowed) {
      throw new AppError("Access denied", 403);
    }
  } catch (e) {
    throw e;
  }
}

exports.getAuthMiddleware = getAuthMiddleware;
