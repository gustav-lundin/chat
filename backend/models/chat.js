const { DataTypes, Model } = require("sequelize");
const sequelize = require("../sequelize");
const { validateString } = require("../validations.js");

class Chat extends Model {}

Chat.init(
  {
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
        max: 30,
        isValid(value) {
          validateString(value);
        },
      },
    },
  },
  { sequelize, modelName: "Chat", tableName: "chats", timestamps: false }
);

module.exports = Chat;
