const { DataTypes, Model } = require("sequelize");
const sequelize = require("../sequelize");
const Chat = require("./chat");
const User = require("./user");

class Message extends Model {}

Message.init(
  {
    // user_id: { type: DataTypes.INTEGER, references: { model: User, key: "id" } },
    // chat,
    content: { type: DataTypes.TEXT, allowNull: false },
  },
  { sequelize, modelName: "User", tableName: "messages", updatedAt: false }
);

// Chat.hasMany(User, { foreignKey: "chat_id" });
Message.belongsTo(Chat, { allowNull: false, foreignKey: "chatId" });
// User.hasMany(Message, { foreignKey: "user_id" });
Message.belongsTo(User, { allowNull: false, foreignKey: "userId" });

module.exports = Message;
