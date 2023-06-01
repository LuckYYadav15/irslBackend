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

const TABLE_NAME = "ch_comps";

var { Handler, generateUniqueString } = require("../services/index");

var handler = new Handler();

class Chatbot {
  // Create new Client
  async create(req, res) {
    const { Id, Type, Name, ResponseText, Tags, AddPipe } = req.body;
    console.log(req.body);
    try {
      //Check if the entered Id is present in Database
      var params = {
        TableName: TABLE_NAME,
        Key: {
          Id: Id,
        },
      };

      const chatbotDetails = await dynamoClient.get(params).promise();

      if (chatbotDetails.Item === undefined) {
        var newChatBot = {
          TableName: TABLE_NAME,
          Item: {
            Id: await generateUniqueString(),
            Type: Type,
            Name: Name,
            ResponseText: ResponseText,
            Tags: Tags,
            AddPipe: AddPipe,
          },
        };

        const saveChatBot = dynamoClient.put(
          newChatBot,
          function (error, data) {
            if (error) {
              handler.error(
                req,
                res,
                error,
                { Id, Type, Name, ResponseText, Tags, AddPipe },
                409         
                );
            } else {
              res.status(201).json({
                flag: true,
                status: "OK",
                message: "ChatBot Created successfully",
                data: newChatBot.Item,
              });

              // Sending the Mail of verification
              // Mail.mailVerification(newClient.Item);
            }
          }
        );
      } else {
        res.status(409).json({
          flag: false,
          status: "OK",
          message: "ChatBot already exists",
        });
      }
    } catch (error) {
      handler.error(
        req,
        res,
        error,
        { Id, Type, Name, ResponseText, Tags, AddPipe },
        409
      );
    }
  }

  // Update ChatBot details
  async update(req, res) {
    const { Id, Type, Name, ResponseText, Tags, AddPipe } = req.body;
    try {
      // Check if the entered OrgId is present in Database
      var params = {
        TableName: TABLE_NAME,
        Key: {
          Id,
        },
      };

      const chatbotDetails = await dynamoClient.get(params).promise();

      // Verifing the Client_name and Client exists
      if (chatbotDetails.Item !== undefined) {
        // Updating the Client details
        var updatedChatBot = {
          TableName: TABLE_NAME,
          Item: {
            ...chatbotDetails.Item,
            Type,
            Name,
            ResponseText,
            Tags,
            AddPipe,
          },
        };

        const saveChatBot = dynamoClient.put(
          updatedChatBot,
          function (error, data) {
            if (error) {
              handler.error(
                req,
                res,
                error,
                { Id, Type, Name, ResponseText, Tags, AddPipe },
                409
              );
            } else {
              res.status(409).json({
                flag: true,
                status: "OK",
                message: "Client Updated successfully",
              });
            }
          }
        );
      } else {
        res.status(409).json({
          flag: false,
          status: "Error",
          message: "Client not found",
        });
      }
    } catch (error) {
      handler.error(
        req,
        res,
        error,
        { Id, Type, Name, ResponseText, Tags, AddPipe },
        400
      );
    }
  }

  // Fetch ChatBot information from the database
  async get(req, res) {
    const { Id } = req.body;
    console.log(req.body);
    try {
      // Fetching the Chatbot details
      var params = {
        TableName: TABLE_NAME,
        Key: {
          Id,
        },
      };

      const chatbotDetails = await dynamoClient.get(params).promise();

      // Sending the Success response
      res.status(200).json({
        flag: true,
        status: "success",
        message: "ChatBot details successfully fetched",
        body: { chatbotDetails },
      });
    } catch (error) {
      handler.error(req, res, error, { Id }, 404);
    }
  }

  // Fetch all ChatBot details from the database
  async getAll(req, res) {
    try {
      const params = {
        TableName: TABLE_NAME,
      };

      const items = await dynamoClient.scan(params).promise();
      const scanResults = items.Items;

      // Sending the success response
      res.status(200).json({
        flag: true,
        status: "success",
        message: "ChatBot details successfully fetched",
        body: { chatbotDetails: scanResults },
      });
    } catch (error) {
      handler.error(req, res, error, {}, 404);
    }
  }

  // Delete ChatBot details
  async delete(req, res) {
    const { Id } = req.body;
    console.log(Id);
    
    try {
      // Check if the entered Id is present in Database
      const params = {
        TableName: TABLE_NAME,
        Key: {
          Id: Id,
        },
      };

      const chatbotDetails = await dynamoClient.get(params).promise();
      console.log(chatbotDetails);

      // Verifying the Chatbot_name and Chatbot exists
      if (chatbotDetails.Item !== undefined) {
        // Deleting the Chatbot details
        await dynamoClient.delete(params).promise();

        // Sending the success response
        res.status(200).json({
          flag: true,
          status: "OK",
          message: "ChatBot deleted successfully",
        });
      } else {
        // Sending the not found response
        res.status(404).json({
          flag: false,
          status: "Error",
          message: "ChatBot not found",
        });
      }
    } catch (error) {
      handler.error(req, res, error, { Id }, 400);
    }
  }
}

module.exports = Chatbot;
