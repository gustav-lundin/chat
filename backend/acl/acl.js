const aclRules = require("./acl-rules.json");
const chatAclRules = require("./chat-acl-rules.json");
const Chat = require("../models/chat");
const ChatMember = require("../models/chatmember");
const AppError = require("../apperror");

function authorizeRequest(route) {
  const callback = async (req, _res, next) => {
    try {
      let userRole = req.session.user ? req.session.user.userRole : "visitor";
      let method = req.method.toLowerCase();
      method = method === "patch" ? "put" : method;
      let allowed = !!aclRules?.[userRole]?.[route]?.[method];
      if (!allowed) {
        if (!isChatRequest(userRole, route, method)) {
          throw new AppError("Access denied", 403);
        }
      }
      next();
    } catch (e) {
      next(e);
    }
  };
  return callback;
}

async function authorizeChatRequest(req, route, method, chatId) {
  try {
    if (!req.session.user) {
      throw new AppError("Access denied", 403);
    } else if (req.session.userRole === aclRules.userRoles.admin) {
      return;
    }
    const chat = await Chat.findByPk(chatId);
    if (chat == null) {
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
    let allowed =
      chatAclRules.user.userChatRoles?.[chatUserRole]?.[route]?.[method];
    if (!allowed) {
      throw new AppError("Access denied", 403);
    }
  } catch (e) {
    throw e;
  }
}

isChatRequest("user", "chatmembers", "post");

function isChatRequest(userRole, reqRoute, reqMethod) {
  const isChatRequest =
    userRole === aclRules.userRoles.user &&
    Object.values(aclRules.user.userChatRoles).some((chatRoleAuths) => {
      return Object.entries(chatRoleAuths).some(([route, auths]) => {
        return (
          route === reqRoute &&
          Object.entries(auths).some(([method, isAllowed]) => {
            return reqMethod === method && isAllowed;
          })
        );
      });
    });
  return isChatRequest;
}

module.exports = authorizeRequest;
