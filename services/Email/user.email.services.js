// User mail service goes here...

var { transporter, mailOptions } = require("./mail.transpoter");

class userMail {
  welcomeMail = async (userData) => {
    let subject = "Welcome to our Website";
    try {
      let bodyContent =
        `<h1>Welcome ${userData.name} To WEBSITE</h1>` +
        "<p>this is a para</p>" +
        '<a href="website.com">Visit website</a>';

      mailOptions.subject = subject;
      mailOptions.to = userData.email;
      mailOptions.html = bodyContent;
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(userData.email, userData.username);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };
}

module.exports = { userMail };
