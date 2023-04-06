// Email sending services goes here...

var { authMail } = require("./auth.email.services");
var { userMail } = require("./user.email.services");

module.exports = { authMail, userMail };
