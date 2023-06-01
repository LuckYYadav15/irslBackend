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
  // async create(req, res) {
  //   const { Name, userId, featureId } = req.body;
  //   console.log(req.body);
  //   try {
  //     // Check if the entered Id is present in Database
  //     // var params = {
  //     //   TableName: TABLE_NAME,
  //     //   Key: {
  //     //     Id: Id,
  //     //   },
  //     // };

  //     // const BotDetails = await dynamoClient.get(params).promise();

  //     // if (BotDetails.Item === undefined) {
  //     // const user = await dynamoClient
  //     //   .get({
  //     //     TableName: "users",
  //     //     Key: {
  //     //       id: userId,
  //     //     },
  //     //   })
  //     //   .promise();

  //     // if (!user.Item) {
  //     //     return res.status(404).json({
  //     //         flag: false,
  //     //         status: "OK",
  //     //         message: "User not found",
  //     //     });
  //     // }

  //     let newBot = {
  //       TableName: TABLE_NAME,
  //       Item: {
  //         Id: await generateUniqueString(),
  //         Name: Name,
  //         userId: userId,
  //         featureId: featureId,
  //         createdOn: new Date().toString(),
  //       },
  //     };

  //     const saveBot = dynamoClient.put(newBot, function (error, data) {
  //       if (error) {
  //         handler.error(
  //           req,
  //           res,
  //           error,
  //           {
  //             Name,
  //             userId,
  //             featureId,
  //           },
  //           409
  //         );
  //       } else {
  //         res.status(201).json({
  //           flag: true,
  //           status: "OK",
  //           message: "Bot Created successfully",
  //           data: newBot.Item,
  //         });
  //         console.log(newBot.Item);
  //       }
  //     });
  //   } catch (error) {
  //     // else {
  //     //   res.status(409).json({
  //     //     flag: false,
  //     //     status: "OK",
  //     //     message: "Bot already exists",
  //     //   });
  //     // }
  //     handler.error(
  //       req,
  //       res,
  //       error,
  //       {
  //         Name,
  //         userId,
  //         featureId,
  //       },
  //       409
  //     );
  //   }
  // }

  async create(req, res) {
    const { id, ch_name, chatbot, ch_comps, userId } = req.body;
    console.log(req.body);
    try {
      let newBot = {
        TableName: TABLE_NAME,
        Item: {
          Id: id,
          ch_comps: ch_comps,
          ch_name: ch_name,
          chatbot: chatbot,
          userId: userId,
          // featureId: ch_comps.map((comp) => comp.id),
          // createdOn: new Date().toString(),
        },
      };

      const saveBot = dynamoClient.put(newBot, function (error, data) {
        if (error) {
          handler.error(
            req,
            res,
            error,
            {
              id,
              ch_name,
              chatbot,
              ch_comps,
              userId,
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
          console.log(newBot.Item);
        }
      });
    } catch (error) {
      handler.error(
        req,
        res,
        error,
        {
          id,
          ch_name,
          chatbot,
          ch_comps,
          userId,
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

  //   async update(req, res) {
  //     const { Id, Name, featureId} = req.body;
  //     // console.log(req.body);
  //     try {
  //       var params = {
  //         TableName: TABLE_NAME,
  //         Key: {
  //           Id: Id,
  //         },
  //       };

  //       const BotDetails = await dynamoClient.get(params).promise();

  //       if (BotDetails.Item !== undefined) {
  //         var updatedBot = {
  //           TableName: TABLE_NAME,
  //           Item: {
  //             ...BotDetails.Item,
  //             Name: Name,
  //             // featureId: [...BotDetails.Item.featureId, ...featureId],
  //             featureId: featureId
  //           },
  //         };

  //         const saveBot = dynamoClient.put(updatedBot, function (error, data) {
  //           if (error) {
  //             handler.error(
  //               req,
  //               res,
  //               error,
  //               {
  //                 Id,
  //                 Name,
  //                 featureId,
  //               },
  //               409
  //             );
  //           } else {
  //             res.status(201).json({
  //               flag: true,
  //               status: "OK",
  //               message: "Bot updated successfully",
  //               data: updatedBot.Item,
  //             })
  //             console.log("Update req:", updatedBot.Item);
  //           }
  //         });
  //       } else {
  //         res.status(409).json({
  //           flag: false,
  //           status: "OK",
  //           message: "Bot not found",
  //         });
  //       }
  //     } catch (error) {
  //       handler.error(
  //         req,
  //         res,
  //         error,
  //         {
  //           Id,
  //           Name,
  //           featureId,
  //         },
  //         409
  //       );
  //     }
  //   }

  async update(req, res) {
    try {
      const botData = req.body;
      console.log(botData);
      const updatePromises = botData.map(async (bot) => {
        const { id, ch_name, chatbot, ch_comps } = bot;

        const params = {
          TableName: TABLE_NAME,
          Key: {
            Id: id,
          },
        };

        const botDetails = await dynamoClient.get(params).promise();

        if (botDetails.Item !== undefined) {
          const updatedBot = {
            TableName: TABLE_NAME,
            Item: {
              ...botDetails.Item,
              ch_name: ch_name,
              chatbot: chatbot,
              ch_comps: ch_comps,
            },
          };

          await dynamoClient.put(updatedBot).promise();

          return {
            Id: id,
            ch_name: ch_name,
            chatbot: chatbot,
            ch_comps: ch_comps,
          };
        } else {
          return {
            Id: id,
            error: "Bot not found",
          };
        }
      });

      const updatedBots = await Promise.all(updatePromises);

      res.status(200).json({
        flag: true,
        status: "OK",
        message: "Bots updated successfully",
        data: updatedBots,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        flag: false,
        status: "Internal Server Error",
        error: error.message,
      });
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
      const { userId } = req.query;

      const params = {
        TableName: TABLE_NAME,
        FilterExpression: "#userId = :userId",
        ExpressionAttributeNames: {
          "#userId": "userId",
        },
        ExpressionAttributeValues: {
          ":userId": userId,
        },
      };

      const botDetails = await dynamoClient.scan(params).promise();
      console.log("botDetails:", botDetails.Items);

      if (botDetails.Items !== undefined) {
        // Extract necessary data from each item
        const extractedData = botDetails.Items.map((item) => {
          const { Id, chatbot, ch_name, ch_comps } = item;
          return {
            id: Id,
            chatbot,
            ch_name,
            ch_comps,
          };
        });

        res.status(200).json({
          flag: true,
          status: "OK",
          data: {
            Items: extractedData,
            Count: botDetails.Count,
            ScannedCount: botDetails.ScannedCount,
          },
        });

        console.log("Extracted data:", extractedData);
      } else {
        res.status(404).json({
          flag: false,
          status: "OK",
          message: "No bots found for the specified user",
        });
      }
    } catch (error) {
      handler.error(req, res, error, {}, 500);
    }
  }
}

module.exports = Bot;
