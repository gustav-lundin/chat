const { DataTypes, Model } = require("sequelize");
const sequelize = require("../sequelize");
// const User = require("./user");
// const Chat = require("./chat");
const AppError = require("../apperror");

class ChatMember extends Model {
  static async getByChatId(chatId) {
    const result = await this.findAll({ where: { chatId: chatId } });
    return result;
  }
  async toggleBlocked() {
    await this.update({ blocked: !this.blocked }, { where: { id: this.id } });
  }
  async acceptInvite() {
    if (this.inviteAccepted) {
      throw new AppError("Invite already accepted", 400);
    }
    this.update({ inviteAccepted: true }, { where: { id: this.id } });
  }
}

ChatMember.init(
  {
    inviteAccepted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    blocked: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  },
  {
    sequelize,
    modelName: "ChatMember",
    tableName: "chat_members",
    timestamps: false,
  }
);

module.exports = ChatMember;
