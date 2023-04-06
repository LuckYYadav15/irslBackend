// Utils for all installed modules goes here...

var { v4: uuidv4 } = require("uuid");
var referralCodeGenerator = require("referral-code-generator");

const generateUniqueString = async () => {
  const String = uuidv4();
  return String;
};

const generateUniquereffCode = async () => {
  const result = await referralCodeGenerator.alphaNumeric("uppercase", 5, 3);
  return result;
};

module.exports = {
  generateUniqueString,
  generateUniquereffCode,
};
