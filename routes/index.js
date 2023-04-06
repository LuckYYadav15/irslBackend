// Routes for api goes here...

//---------------------------------------------MODULES---------------------------------------------
const express = require("express");
const userRouter = require("./user.route");
const chatbotRouter = require("./chatbot.route");
const botRouter = require("./bot.route");

var router = new express.Router();

router.get("/", async (request, response) => {
  response.json({ status: "success", api: "connected", version: "1.0.0" });
});

router.use("/api/user", userRouter);
router.use("/api/chatbot", chatbotRouter);
router.use("/api/bot", botRouter);

module.exports = router;
