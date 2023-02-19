const Chat = require("../models/chat");
const ChatMember = require("../models/chatmember");
const Message = require("../models/message");
const User = require("../models/user");
const chatData = require("./testdata/chats.json");
const messageData = require("./testdata/messages.json");
const userData = require("./testdata/users.json");
const chatMemberData = require("./testdata/chatMembers.json");

async function seeder() {
  console.log("Seeder initialized");
  try {
    for (const user of userData) {
      await User.create(user);
    }
    for (const chat of chatData) {
      await Chat.create(chat);
    }
    for (const chatMember of chatMemberData) {
      await ChatMember.create(chatMember);
    }
    for (const message of messageData) {
      await Message.create(message);
    }
  } catch (e) {
    console.log("Seeder Error: ", e);
  }
}
module.exports = seeder;
