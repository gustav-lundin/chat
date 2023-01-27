const { DataTypes, Model } = require("sequelize");
const sequelize = require("../sequelize");
const passwordEncryptor = require("../util/passwordEncryptor");
class User extends Model {
  dto() {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      userRole: this.userRole,
    };
  }
}

User.init(
  {
    firstName: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: { notEmpty: true },
    },
    lastName: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: { notEmpty: true },
    },
    email: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false,
      // set(value) {
      //   this.setDataValue("password"), passwordEncryptor(value); maybe not safe
      // },
    },
    userRole: { type: DataTypes.TEXT, allowNull: false, field: "user_role" },
    fullName: {
      type: DataTypes.VIRTUAL,
      get() {
        return `${this.firstName} ${this.lastName}`;
      },
      set(value) {
        throw new Error("Do not try to set the `fullName` value!");
      },
    },
  },
  { sequelize, modelName: "User", tableName: "users", timestamps: false }
);

// User.sync({ alter: true })
//   .then(() => console.log("Users created"))
//   .catch(() => console.log("User creation failed"));

module.exports = User;
