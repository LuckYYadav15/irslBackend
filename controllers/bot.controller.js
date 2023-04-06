// Controllers for users class goes here
var AWS = require("aws-sdk");

require("dotenv").config();
AWS.config.update({
  region: process.env.AWS_DATABASE_DEFAULT_REGION,
  accessKeyId: process.env.AWS_DATABASE_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_DATABASE_SECRET_ACCESS_KEY,
});

const dynamoClient = new AWS.DynamoDB.DocumentClient({
  apiVersion: "2022-09-28",
});

const TABLE_NAME = "ch_bot";

var { Handler, generateUniqueString } = require("../services/index");

var handler = new Handler();

class Bot {
  async create(req, res) {
    const { Id, Name, userId, featureId } = req.body;
    console.log(req.body);
    try {
      // Check if the entered Id is present in Database
      var params = {
        TableName: TABLE_NAME,
        Key: {
          Id: Id,
        },
      };

      const BotDetails = await dynamoClient.get(params).promise();

      if (BotDetails.Item === undefined) {
        // const user = await dynamoClient
        //   .get({
        //     TableName: "users",
        //     Key: {
        //       id: userId,
        //     },
        //   })
        //   .promise();
        
        // if (!user.Item) {
        //     return res.status(404).json({
        //         flag: false,
        //         status: "OK",
        //         message: "User not found",
        //     });
        // }

          let newBot = {
            TableName: TABLE_NAME,
            Item: {
              Id: await generateUniqueString(),
              Name: Name,
              userId: userId,
              featureId: featureId,
              createdOn: new Date().toString(),
            },
          };

          const saveBot = dynamoClient.put(newBot, function (error, data) {
            if (error) {
              handler.error(
                req,
                res,
                error,
                {
                  Id,
                  Name,
                  userId,
                  featureId,
                },
                409
              );
            } else {
              res.status(201).json({
                flag: true,
                status: "OK",
                message: "Bot Created successfully",
                data: newBot.Item,
              });
            }
          });
        }
      else {
        res.status(409).json({
          flag: false,
          status: "OK",
          message: "Bot already exists",
        });
      }
    } catch (error) {
      handler.error(
        req,
        res,
        error,
        {
          Id,
          Name,
          userId,
          featureId,
        },
        409
      );
    }
  }

  async delete(req, res) {
    const { Id } = req.body;
    try {
      // Check if the entered Id is present in Database
      var params = {
        TableName: TABLE_NAME,
        Key: {
          Id: Id,
        },
      };

      const BotDetails = await dynamoClient.get(params).promise();

      if (BotDetails.Item !== undefined) {
        const deleteBot = dynamoClient.delete(params, function (error, data) {
          if (error) {
            handler.error(
              req,
              res,
              error,
              { Id },

              409
            );
          } else {
            res.status(201).json({
              flag: true,
              status: "OK",
              message: "Bot deleted successfully",
              data: BotDetails.Item,
            });
          }
        });
      } else {
        res.status(409).json({
          flag: false,
          status: "OK",
          message: "Bot not found",
        });
      }
    } catch (error) {
      handler.error(req, res, error, { Id }, 409);
    }
  }

  async update(req, res) {
    const { Id, Name } = req.body;
    console.log(req.body);
    try {
      var params = {
        TableName: TABLE_NAME,
        Key: {
          Id: Id,
        },
      };

      const BotDetails = await dynamoClient.get(params).promise();

      if (BotDetails.Item !== undefined) {
        var updatedBot = {
          TableName: TABLE_NAME,
          Item: {
            ...BotDetails.Item,
            Name: Name,
          },
        };

        const saveBot = dynamoClient.put(updatedBot, function (error, data) {
          if (error) {
            handler.error(
              req,
              res,
              error,
              {
                Id,
                Name,
              },
              409
            );
          } else {
            res.status(201).json({
              flag: true,
              status: "OK",
              message: "Bot updated successfully",
            });
          }
        });
      } else {
        res.status(409).json({
          flag: false,
          status: "OK",
          message: "Bot not found",
        });
      }
    } catch (error) {
      handler.error(
        req,
        res,
        error,
        {
          Id,
          Name,
        },
        409
      );
    }
  }

  async get(req, res) {
    const { Id } = req.body;
    try {
      var params = {
        TableName: TABLE_NAME,
        Key: {
          Id,
        },
      };

      const BotDetails = await dynamoClient.get(params).promise();

      if (BotDetails.Item !== undefined) {
        res.status(201).json({
          flag: true,
          status: "OK",
          data: BotDetails.Item,
        });
      } else {
        res.status(409).json({
          flag: false,
          status: "OK",
          message: "Bot not found",
        });
      }
    } catch (error) {
      handler.error(
        req,
        res,
        error,
        {
          Id,
        },
        409
      );
    }
  }

  async getAll(req, res) {
    try {
      var params = {
        TableName: TABLE_NAME,
      };

      const BotDetails = await dynamoClient.scan(params).promise();

      if (BotDetails.Items !== undefined) {
        res.status(201).json({
          flag: true,
          status: "OK",
          data: BotDetails.Items,
        });
      } else {
        res.status(409).json({
          flag: false,
          status: "OK",
          message: "Bot not found",
        });
      }
    } catch (error) {
      handler.error(req, res, error, {}, 409);
    }
  }
}

module.exports = Bot;
