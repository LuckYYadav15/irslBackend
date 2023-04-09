// Routes for users class goes here

//---------------------------------------------MODULES---------------------------------------------
var express = require("express");
var Users = require("../controllers/user.controller");
const cors = require("cors");
const app = express();
app.use(cors());
//---------------------------------------------INSTANCE---------------------------------------------
var userRouter = new express.Router();
var User = new Users();

// Create a new User
userRouter.put("/create", User.create);

// Update user details
userRouter.put("/update", User.update);

// Get user details
userRouter.get("/get", User.get);

// For Checking Login credentials
userRouter.put("/login", User.userLogin);

// For resending verification link
userRouter.put("/send/verificationlink", User.sendVerificationLink);

// For Checking verifing mail link
userRouter.put("/verify/mailverification", User.emailVerification);

// For reseting password
userRouter.put("/forget/password", User.resetPassword);

module.exports = userRouter;
