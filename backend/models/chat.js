const { DataTypes, Model } = require("sequelize");
const sequelize = require("../sequelize");
const User = require("./user");

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

// User.hasMany(Chat);
Chat.belongsTo(User, {
  foreignKey: { allowNull: false, name: "userId" },
});

module.exports = Chat;
