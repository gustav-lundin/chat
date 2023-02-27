const { DataTypes, Model } = require("sequelize");
const sequelize = require("../sequelize");

class Chat extends Model {}

Chat.init(
  {
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: { notEmpty: true },
    },
  },
  { sequelize, modelName: "Chat", tableName: "chats", timestamps: false }
);

module.exports = Chat;
