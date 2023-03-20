const sseRouter = require("express").Router();
const { getAuthMiddleware } = require("../../acl/acl.js");

///
let chatIdToUserIdToRes = new Map();

const auth = getAuthMiddleware("sse");
sseRouter.get("/:chatId", auth, (req, res) => {
  const chatId = req.params.chatId;
  const userId = req.session.user.id;
  if (!chatIdToUserIdToRes.has(chatId)) {
    const userIdToRes = new Map();
    userIdToRes.set(userId, res);
    chatIdToUserIdToRes.set(chatId, userIdToRes);
  } else {
    chatIdToUserIdToRes.get(chatId).set(userId, res);
  }
  const userIdToRes = chatIdToUserIdToRes.get(chatId);

  req.on("close", () => {
    userIdToRes.delete(userId);

    broadcast(
      "disconnect",
      {
        message: "client disconnected",
      },
      chatId
    );
  });

  res.set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
  });

  broadcast(
    "connect",
    {
      message: `clients connected: ${Array.from(userIdToRes.values()).length}`,
    },
    chatId
  );
});

function broadcast(event, data, chatId = null) {
  let responses = [];
  if (chatId == null) {
    const allUserIdToRes = chatIdToUserIdToRes.values();
    for (const userIdToRes of allUserIdToRes) {
      for (const res of userIdToRes.values()) {
        responses.push(res);
      }
    }
  } else {
    responses = chatIdToUserIdToRes.has(chatId)
      ? chatIdToUserIdToRes.get(chatId).values()
      : [];
  }
  for (const res of responses) {
    res.write("event:" + event + "\ndata:" + JSON.stringify(data) + "\n\n");
  }
}

setInterval(() => {
  broadcast("keep-alive", "");
}, 25000);
///

exports.sseRouter = sseRouter;
exports.broadcast = broadcast;
