const aclRules = require("./acl-rules.json");
const chatAclRules = require("./chat-acl-rules.json");
const Chat = require("../models/chat");
const ChatMember = require("../models/chatmember");

function authorizeRequest(route) {
  const callback = (req, res, next) => {
    if (req.body.chatId) {
      return authorizeChatRequest(route);
    }
    let userRole = req.session.user ? req.session.user.userRole : "visitor";
    let method = req.method.toLowerCase();
    method = method === "patch" ? "put" : method;
    let allowed = !!aclRules?.[userRole]?.[route]?.[method];
    if (!allowed) {
      res.status(405);
      res.json({ _error: "Not allowed" });
      return;
    } else {
      next();
    }
  };
  return callback;
}

function authorizeChatRequest(tableName) {
  const callback = async (req, res, next) => {
    let chatUserRole;
    if (!req.session.user) {
      res.status(405).json({ _error: "Access denied" });
      return;
    }
    if (req.session.user.userRole === "admin") {
      res.next();
    }
    const chat = await Chat.findByPk(req.body.chatId);
    if (chat == null) {
      res.status(404).json({ _error: "Chat does not exist" });
      return;
    }
    if (chat.userId == req.session.user.id) {
      chatUserRole = "chatAdmin";
    } else {
      const chatMember = await ChatMember.findOne({
        where: { chatId: chat.id, userId: req.session.user.id },
      });
      if (chatMember == null || !chatMember.inviteAccepted) {
        res.status(405).json({ _error: "Access denied" });
        return;
      }
      chatUserRole = "chatMember";
    }

    let method = req.method.toLowerCase();
    method = method === "patch" ? "put" : method;
    let allowed = chatAclRules?.[chatUserRole]?.[tableName]?.[method];
    if (!allowed) {
      res.status(405);
      res.json({ _error: "Not allowed" });
      return;
    } else {
      next();
    }
  };
  return callback;
}

module.exports = authorizeRequest;
