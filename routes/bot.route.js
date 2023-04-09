//---------------------------------------------MODULES---------------------------------------------
var express = require("express");
var Bot = require("../controllers/bot.controller");
const cors = require("cors");
const app = express();
app.use(cors());
//---------------------------------------------INSTANCE---------------------------------------------
var botRouter = new express.Router();
var Bot = new Bot();

//---------------------------------------------ROUTES---------------------------------------------
botRouter.put("/create", Bot.create);

botRouter.delete("/delete", Bot.delete);

botRouter.get("/get", Bot.get);

botRouter.get("/getall", Bot.getAll);

botRouter.put("/update", Bot.update);

module.exports = botRouter;
