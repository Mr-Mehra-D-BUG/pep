//setting routers name.
// using Router() function for reducing route path =>
const express = require("express");
const userRouter = express.Router();
// import userController
const {
  getAlluserController,
  profileController,
} = require("../controller/userController");
// import authController for protect router middle ware
const { protectRoute } = require("../controller/authController");

//users data => get all user data => sensitive data => add midlleware with in it => only loged in user get that data
userRouter.get("/users", protectRoute, getAlluserController);

// get user data =>  who is loged in current time .
userRouter.get("/user", protectRoute, profileController);

module.exports = userRouter;
