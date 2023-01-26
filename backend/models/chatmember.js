const { DataTypes, Model } = require("sequelize");
const sequelize = require("../sequelize");
const User = require("./user");
const Chat = require("./chat");

class ChatMember extends Model {}

ChatMember.init(
  {
    inviteAccepted: { type: DataTypes.BOOLEAN, allowNull: false },
  },
  {
    sequelize,
    modelName: "ChatMember",
    tableName: "chat_members",
    timestamps: false,
  }
);

User.belongsToMany(Chat, {
  through: ChatMember,
  foreignKey: { name: "userId", allowNull: false },
});
Chat.belongsToMany(User, {
  through: ChatMember,
  foreignKey: { name: "chatId", allowNull: false },
});

module.exports = ChatMember;
