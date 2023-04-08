// Master file for backend

require("dotenv").config();
//---------------------------------------------MODULES---------------------------------------------
var express = require("express");
var session = require("express-session");
var cors = require("cors");
var router = require("./routes/index");
var logger = require("morgan");

//---------------------------------------------VARIABLES--------------------------------------------
var port = process.env.PORT || 8000;

//---------------------------------------------INSTANCE---------------------------------------------
var app = express();

//---------------------------------------------MIDDLEWARES------------------------------------------
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use("/", router);

//---------------------------------------------SERVER------------------------------------------
app.listen(port, (error) => {
  if (error) {
    console.log(error);
    console.log("\n");
  }
  console.log("\n");
  console.log(`Server is online and listening at port ${port}... 🚀`);
});
