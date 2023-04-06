var { Handler } = require("./handle.service");
var { authMail, userMail } = require("./Email/index");
var { generateUniqueString, generateUniquereffCode } = require("./Utils/index");

module.exports = {
  Handler,
  authMail,
  userMail,
  generateUniqueString,
  generateUniquereffCode,
};
