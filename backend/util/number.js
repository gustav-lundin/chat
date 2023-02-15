exports.isStringNumber = (text) => {
  return /\s/.test(text) ? false : !isNaN(Number(text));
};
