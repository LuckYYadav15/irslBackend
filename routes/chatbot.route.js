//---------------------------------------------MODULES---------------------------------------------
var express = require('express');
var Chatbots = require("../controllers/chatbot.controller");

//---------------------------------------------INSTANCE---------------------------------------------
var ChatbotRouter = new express.Router();
var Chatbot = new Chatbots();


// For deleting Chatbot 
ChatbotRouter.delete('/delete', Chatbot.delete);

// Get Chatbot details
ChatbotRouter.get('/get', Chatbot.get);

// Get all Chatbot details
ChatbotRouter.get('/getall', Chatbot.getAll);

// Create a new Chatbot
ChatbotRouter.put('/create',Chatbot.create);

// Update Chatbot details
ChatbotRouter.put('/update',Chatbot.update);


module.exports = ChatbotRouter;