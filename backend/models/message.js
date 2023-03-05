const { DataTypes, Model } = require("sequelize");
const sequelize = require("../sequelize");
const { validateString } = require("../validations");

class Message extends Model {}

Message.init(
  {
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
        max: 200,
        isValid(value) {
          validateString(value);
        },
      },
    },
  },
  { sequelize, modelName: "Message", tableName: "messages", updatedAt: false }
);

module.exports = Message;
