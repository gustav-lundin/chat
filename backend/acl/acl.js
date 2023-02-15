const aclRules = require("./acl-rules.json");
const Chat = require("../models/chat");
const ChatMember = require("../models/chatmember");
const AppError = require("../apperror");

const getAuthMiddleware = (route) => {
  return async (req, _res, next) => {
    try {
      if (req.params.chatId && req.session.user.userRole != "admin") {
        authorizeChatRequest(route, req);
      } else {
        authorizeRequest(route, req);
      }
      next();
    } catch (e) {
      next(e);
    }
  };
};

function authorizeRequest(route, req) {
  let userRole = req.session?.user ? req.session.user.userRole : "visitor";
  let method = req.method.toLowerCase();
  method = method === "patch" ? "put" : method;
  let allowed = !!aclRules?.[userRole]?.[route]?.[method];
  if (!allowed) {
    throw new AppError("Access denied", 403);
  }
}

async function authorizeChatRequest(req, route) {
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
    if (chat.userId == req.session.user.id) {
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
    let method = req.method.toLowerCase();
    method = method === "patch" ? "put" : method;
    let allowed = user.userChatRoles?.[chatUserRole]?.[route]?.[method];
    if (!allowed) {
      throw new AppError("Access denied", 403);
    }
  } catch (e) {
    throw e;
  }
}

exports.getAuthMiddleware = getAuthMiddleware;
