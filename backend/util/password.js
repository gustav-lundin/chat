// using the built in crypto module of Node.js
const crypto = require("crypto");
const { isLetter } = require("./string");

// salt for encryption
let salt = "shouldBeHardToGuessAndUniqueForEachProjectAHAHAAHaba@132";

// if we are running in production mode and no passwordsa or short password salt exit
if (process.env.PRODUCTION) {
  if (!process.env.PASSWORD_SALT) {
    console.log(
      "Shutting down, in production and missing env. variable PASSWORD_SALT"
    );
    process.exit();
  } else if (process.env.PASSWORD_SALT.length < 32) {
    console.log("Shutting down, env. variable PASSWORD_SALT too short.");
    process.exit();
  } else {
    salt = process.env.PASSWORD_SALT;
  }
}

exports.encryptPassword = (password) => {
  if (typeof password !== "string") {
    return null;
  } // secure?
  return crypto
    .createHmac("sha256", salt) // choose algorithm and salt
    .update(password) // send the string to encrypt
    .digest("hex"); // decide on output format (in our case hexadecimal)
};

exports.passwordIsStrong = (password) => {
  let result = { isStrong: true, msg: "" };
  if (password.length < 8) {
    result.msg = "Password too short";
    result.isStrong = false;
    return result;
  }
  if (Array.from(password).every((char) => isLetter(char))) {
    result.msg = "Password must contain a digit or a special character";
    result.isStrong = false;
    return result;
  }
  return result;
};
