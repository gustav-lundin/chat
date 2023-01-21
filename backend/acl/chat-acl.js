const chatAclRules = require("./chat-acl-rules.json");

function getChatUserRole(req, chatId) {}

module.exports = function (tableName, req) {
  if (!req.session.user) {
    return false;
  } else if (req.session.user.userRole === "admin") {
    return true;
  }
  let method = req.method.toLowerCase();
  method = method === "patch" ? "put" : method;
  let allowed = chatAclRules?.[userRole]?.[tableName]?.[method];
  return !!allowed;
};
