const express = require("express");
const loginRouter = require("./routes/login.js");
const userRouter = require("./routes/user");
const chatRouter = require("./routes/chat");
const messageRouter = require("./routes/message");
const chatMemberRouter = require("./routes/chatmember");
const { sseRouter } = require("./routes/sse");

const router = express.Router();

router.use("/login", loginRouter);
router.use("/users", userRouter);
router.use("/chats", chatRouter);
router.use("/messages", messageRouter);
router.use("/chatmembers", chatMemberRouter);
router.use("/sse", sseRouter);

exports.router = router;
