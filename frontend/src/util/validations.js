function validatePassword(password, passwordConfirm) {
  if (password !== passwordConfirm) {
    return "Passwords do not match";
  }
  if (password.length < 8) {
    return "Password too short";
  }
  if (password.length > 256) {
    return "Password is too long";
  }
  if (Array.from(password).every((char) => isLetter(char))) {
    return "Password must contain a digit or a special character";
  }
  return "";
}

function validateName(name, label) {
  if (label !== "email" && !Array.from(name).every((char) => isLetter(char))) {
    return `${label} can only contain characters`;
  }
  let maxLength = 64;
  if (label === "email") {
    maxLength = 254;
  }
  if (name.length > maxLength) {
    return `${label} is too long`;
  }
  return "";
}

function isLetter(char) {
  return char.toLowerCase() !== char.toUpperCase();
}

export { validatePassword, validateName };
