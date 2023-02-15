const { DataTypes, Model } = require("sequelize");
// const { authorizeChatRequest } = require("../acl/acl");
const sequelize = require("../sequelize");
const User = require("./user");

class Chat extends Model {
  async getChatMembers(req) {
    // await this.authorizeChatRequest(req, routeNames.chatMembers);
    // SELECT * FROM users
    // WHERE users.id = chatmembers.id
    // AND chatmembers.chatId = params.chatId
    // AND chatmembers.inviteAccepted != false
    Chat.findByPk(chatId, {
      include: {
        model: User,
        where: { inviteAccepted: { [Op.ne]: false } },
        through: {
          attributes: ["id", "firstName", "lastName", "email", "userRole"],
          where: { inviteAccepted: true },
        },
      },
    });
  }
  static async getMessages() {}
}

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
