// Authencation mail service goes here...

var {
  transporter,
  mailOptions,
  apiClientUrl,
  apiHostTestUrl,
} = require("./mail.transpoter");

class authMail {
  // Send a mail for Verification of Email Address
  mailVerification = async (userData, reasonToSendMail) => {
    let subject = "Email Verification";
    try {
      let body;
      if (reasonToSendMail === "signup") {
        body = `Hey ${userData.name}, use this link to verify your email <br/>`;
      } else {
        body = `Hey ${userData.name}, Use this link to reset your password <br/>`;
      }

      let bodyContent = body;

      bodyContent +=
        apiClientUrl +
        `/mailverification/${userData.id}/${userData.verificationtoken}?reason=${reasonToSendMail}`;

      mailOptions.subject = subject;
      mailOptions.to = userData.email_id;
      mailOptions.html = bodyContent;
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.error(error);
          console.log(userData.email_id, userData.name);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };
}

module.exports = { authMail };
