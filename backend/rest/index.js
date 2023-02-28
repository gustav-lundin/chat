const express = require("express");
const loginRouter = require("./routes/login.js");
const userRouter = require("./routes/user");
const chatRouter = require("./routes/chat");
const messageRouter = require("./routes/message");
const chatMemberRouter = require("./routes/chatmember");

const router = express.Router();

router.use("/login", loginRouter);
router.use("/users", userRouter);
router.use("/chats", chatRouter);
router.use("/messages", messageRouter);
router.use("/chatmembers", chatMemberRouter);

exports.router = router;
