const aclRules = require("./acl-rules.json");

function authorizeRequest(tableName) {
  const callback = (req, res) => {
    console.log(tableName);
    let userRole = req.session.user ? req.session.user.userRole : "visitor";
    let method = req.method.toLowerCase();
    method = method === "patch" ? "put" : method;
    let allowed = !!aclRules?.[userRole]?.[tableName]?.[method];
    if (!allowed) {
      res.status(405);
      res.json({ _error: "Not allowed" });
    }
  };

  return callback;
}

module.exports = authorizeRequest;
