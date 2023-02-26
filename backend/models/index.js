const Chat = require("./chat.js");
const ChatMember = require("./chatmember.js");
const User = require("./user.js");
const Message = require("./message.js");

User.belongsToMany(Chat, {
  through: ChatMember,
  foreignKey: { name: "userId", allowNull: false },
  as: "chatMembers",
});
Chat.belongsToMany(User, {
  through: ChatMember,
  foreignKey: { name: "chatId", allowNull: false },
  as: "chatMembers",
});

Chat.hasMany(Message, {
  foreignKey: { allowNull: false, name: "chatId" },
  as: "chatMessages",
});
Message.belongsTo(Chat, {
  foreignKey: { allowNull: false, name: "chatId" },
  as: "chatMessages",
});

User.hasMany(Message, {
  foreignKey: { allowNull: false, name: "userId" },
  // as: "user",
});
Message.belongsTo(User, {
  foreignKey: { allowNull: false, name: "userId" },
  // as: "user",
});

exports.Message = Message;
exports.Chat = Chat;
exports.ChatMember = ChatMember;
exports.User = User;
