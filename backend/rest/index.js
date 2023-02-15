const express = require("express");
const loginRouter = require("./routes/login.js");
const userRouter = require("./routes/user");
const chatRouter = require("./routes/chat");
const messageRouter = require("./routes/message");
const chatMemberRouter = require("./routes/chatmember");
const { getAuthMiddleware } = require("../acl/acl.js");

const router = express.Router();

router.use("/login", getAuthMiddleware("login"), loginRouter);
router.use("/users", getAuthMiddleware("users"), userRouter);
router.use("/chats", getAuthMiddleware("chats"), chatRouter);
router.use("/messages", getAuthMiddleware("messages"), messageRouter);
router.use("/chatmembers", getAuthMiddleware("chatMembers"), chatMemberRouter);

exports.router = router;
