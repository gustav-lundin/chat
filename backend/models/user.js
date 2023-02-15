const { DataTypes, Model } = require("sequelize");
const AppError = require("../apperror");
const sequelize = require("../sequelize");
const passwordIsStrong = require("../util/password");
const encryptPassword = require("../util/password");
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
      field: "first_name",
    },
    lastName: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: { notEmpty: true },
      field: "last_name",
    },
    email: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
      set(value) {
        this.setDataValue("email", value.toLowerCase().trim());
      },
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        isStrong(password) {
          const validate = passwordIsStrong(password);
          if (!validate.isStrong) {
            throw new AppError(validate.msg, 400);
          }
        },
      },
      set(password) {
        this.setDataValue("password", encryptPassword(password));
      },
    },
    userRole: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: "user_role",
      defaultValue: "user",
    },
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

module.exports = User;
