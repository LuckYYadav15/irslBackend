// Controllers for users class goes here
var AWS = require("aws-sdk");
var bcrypt = require("bcryptjs");

require("dotenv").config();
AWS.config.update({
  region: process.env.AWS_DATABASE_DEFAULT_REGION,
  accessKeyId: process.env.AWS_DATABASE_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_DATABASE_SECRET_ACCESS_KEY,
});

const dynamoClient = new AWS.DynamoDB.DocumentClient({
  apiVersion: "2022-09-22",
});

const TABLE_NAME = "users";

var {
  Handler,
  authMail,
  userMail,
  generateUniqueString,
  generateUniquereffCode,
} = require("../services/index");

var handler = new Handler();
var Mail = new authMail();

class User {
  // Create new user
  async create(req, res) {
    const { email, password } = req.body;

    // Hashing the Password
    let pass = await bcrypt.hash(password, 10);

    try {
      // Check if the entered Email is present in Database
      var params = {
        TableName: TABLE_NAME,
        Key: {
          email_id: email,
        },
      };

      const userDetails = await dynamoClient.get(params).promise();

      if (userDetails.Item === undefined) {
        var newUser = {
          TableName: TABLE_NAME,
          Item: {
            id: await generateUniqueString(),
            email_id: email,
            password: pass,
            // referalCode: await generateUniquereffCode(),
            verificationStatus: true,
            verificationtoken: await generateUniqueString(),
            created_on: new Date().toString(),
            updated_on: new Date().toString(),
            is_active: true,
          },
        };

        const saveUser = dynamoClient.put(newUser, function (error, data) {
          if (error) {
            handler.error(req, res, error, { email, password }, 409);
          } else {
            res.status(201).json({
              flag: true,
              status: "OK",
              message: "User Created successfully",
            });
          }
        });
      } else {
        res.status(409).json({
          flag: false,
          status: "OK",
          message: "User already exists",
        });
      }
    } catch (error) {
      handler.error(req, res, error, { email, password }, 409);
    }
  }

  // For sending the email again for verification
  async sendVerificationLink(req, res) {
    const { email, reason } = req.body;

    try {
      // Check if the entered Email is present in Database
      var params = {
        TableName: TABLE_NAME,
        Key: {
          email_id: email,
        },
      };

      const userDetails = await dynamoClient.get(params).promise();

      if (userDetails.Item === undefined) {
        res.status(200).json({
          flag: false,
          status: "OK",
          message: "User dose not exists",
        });
      } else {
        const reasonToSendMail = reason;

        // Sending the Mail of verification
        Mail.mailVerification(userDetails.Item, reasonToSendMail);

        res.status(200).json({
          flag: true,
          status: "OK",
          message: "Mail verification link sent successfully",
        });
      }
    } catch (e) {
      handler.error(req, res, e, { email }, 409);
    }
  }

  // Update user details
  async update(req, res) {
    const { name, phone } = req.body;
    const { email } = req.body;
    try {
      // Check if the entered Email is present in Database
      var params = {
        TableName: TABLE_NAME,
        Key: {
          email_id: email,
        },
      };

      const userDetails = await dynamoClient.get(params).promise();

      // Verifing the username and user exists
      if (userDetails.Item !== undefined) {
        // Updating the user details
        var updatedUser = {
          TableName: TABLE_NAME,
          Item: {
            ...userDetails.Item,
            name: name,
            phone: phone,
          },
        };

        const saveUser = dynamoClient.put(updatedUser, function (error, data) {
          if (error) {
            handler.error(req, res, error, { email, password }, 409);
          } else {
            res.status(409).json({
              flag: true,
              status: "OK",
              message: "User Updated successfully",
            });
          }
        });
      } else {
        res.status(409).json({
          flag: false,
          status: "Error",
          message: "User not found",
        });
      }
    } catch (error) {
      handler.error(req, res, error, { email, password }, 400);
    }
  }

  // Fetch user information from the database
  async get(req, res) {
    const { email } = req.body;

    try {
      // Fectcing the user details
      var params = {
        TableName: TABLE_NAME,
        Key: {
          email_id: email,
        },
      };

      const userDetails = await dynamoClient.get(params).promise();

      // Sending the Success response
      res.status(200).json({
        flag: true,
        status: "success",
        message: "User details successfully fetched",
        body: { userDetails },
      });
    } catch (error) {
      handler.error(req, res, error, { email }, 404);
    }
  }

  // Verify the user details for login purposes
  async userLogin(req, res) {
    const { email, password } = req.body;

    try {
      // Fetch user information from the database
      var params = {
        TableName: TABLE_NAME,
        Key: {
          email_id: email,
        },
      };

      const userDetails = await dynamoClient.get(params).promise();

      // if user is not found
      if (!userDetails.Item) {
        const error = new Error("Email doesn't exists");
        handler.error(req, res, error, { email, password }, 400);
        return;
      }

      // if user activity > 0 means user is verified and active
      if (
        userDetails.Item.is_active === true &&
        userDetails.Item.verificationStatus === true
      ) {
        // Checking the password with database
        const isMatch = await bcrypt.compare(
          password,
          userDetails.Item.password
        );

        // if password is matched with password present in database
        if (isMatch) {
          // Sending success message
          res.status(200).json({
            flag: true,
            status: "Success",
            message: "User is verified",
            body: { 
              userDetails: {
                ...userDetails.Item,
                userId: userDetails.Item.userId // add userId to the userDetails object
              } 
            },
          });
        } else {
          const error = new Error("password doesn't match");
          handler.error(req, res, error, { email, password }, 400);
          return;
        }
      } else {
        const error = new Error("user is not varified or active");
        handler.error(req, res, error, { email, password }, 400);
        return;
      }
    } catch (error) {
      console.log(error);
      handler.error(req, res, error, { email, password }, 404);
    }
  }

  // Verify the email link
  async emailVerification(req, res) {
    const { userid, token } = req.body;

    try {
      // Fetch user information from the database
      var params = {
        TableName: TABLE_NAME,
        ScanFilter: {
          id: {
            ComparisonOperator: "EQ",
            AttributeValueList: [userid],
          },
        },
      };

      const userDetails = await dynamoClient.scan(params).promise();

      // Verifing the token from present in link
      if (userDetails.Items[0].verificationtoken === token) {
        // update the user information and set activity status to true
        var updatedUser = {
          TableName: TABLE_NAME,
          Key: {
            email_id: userDetails.Items[0].email_id,
          },
          Item: {
            ...userDetails.Items[0],
            verificationtoken: await generateUniqueString(),
            verificationStatus: true,
          },
        };

        const saveUser = dynamoClient.put(updatedUser, function (error, data) {
          if (error) {
            handler.error(req, res, error, { token, userid }, 409);
          } else {
            res.status(200).json({
              flag: true,
              status: "OK",
              message: "User verified successfully",
            });
          }
        });
      } else {
        res.status(409).json({
          flag: false,
          status: "Error",
          message: "Credentials not matching",
        });
      }
    } catch (e) {
      handler.error(req, res, e, { userid }, 500);
    }
  }

  async resetPassword(req, res) {
    const { userid, newPassword } = req.body;

    try {
      // Fetch user information from the database
      var params = {
        TableName: TABLE_NAME,
        ScanFilter: {
          id: {
            ComparisonOperator: "EQ",
            AttributeValueList: [userid],
          },
        },
      };

      const userDetails = await dynamoClient.scan(params).promise();

      if (userDetails) {
        const oldHashPassword = userDetails.Items[0].password;
        const newHashPassword = await bcrypt.hash(newPassword, 10);
        // Checking the password with database
        const isMatch = await bcrypt.compare(newPassword, oldHashPassword);

        if (isMatch) {
          // Sending the response
          res.status(200).json({
            flag: false,
            status: "Error",
            message:
              "Entered password matches the old password, Please try another one",
          });
        } else {
          var updatedPassword = {
            TableName: TABLE_NAME,
            Key: {
              email_id: userDetails.Items[0].email_id,
            },
            Item: {
              ...userDetails.Items[0],
              password: newHashPassword,
            },
          };

          const savePassword = dynamoClient.put(
            updatedPassword,
            function (error, data) {
              if (error) {
                handler.error(req, res, error, { userid, newPassword }, 409);
              } else {
                res.status(200).json({
                  flag: true,
                  status: "OK",
                  message: "User Password updated successfully",
                });
              }
            }
          );
        }
      }
    } catch (error) {
      handler.error(req, res, error, { userid, newPassword }, 404);
    }
  }
}

module.exports = User;
