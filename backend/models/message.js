const { DataTypes, Model } = require("sequelize");
const sequelize = require("../sequelize");
// const Chat = require("./chat");
// const User = require("./user");

class Message extends Model {}

Message.init(
  {
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: { notEmpty: true },
    },
  },
  { sequelize, modelName: "Message", tableName: "messages", updatedAt: false }
);

module.exports = Message;
