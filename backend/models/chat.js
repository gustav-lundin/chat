const { DataTypes, Model } = require("sequelize");
const sequelize = require("../sequelize");
const AppError = require("../apperror");

class Chat extends Model {}

Chat.init(
  {
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
        isValid(value) {
          if (!(typeof value === "string")) {
            throw new AppError("only string allowed for name");
          }
        },
      },
    },
  },
  { sequelize, modelName: "Chat", tableName: "chats", timestamps: false }
);

module.exports = Chat;
