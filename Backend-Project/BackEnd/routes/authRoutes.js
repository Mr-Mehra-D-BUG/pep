//setting routers name.
// using Router() function for reducing route path =>
const express = require("express");
const authRouter = express.Router();
const {signupController , loginController ,forgotPasswordController ,resetController} = require("../controller/authController");
// singnup and create document  at foodmodel
authRouter.post("/signup", signupController);
// log-in input => email + password
authRouter.post("/login", loginController);
// forgot password =>
authRouter.patch("/forgotPassword", forgotPasswordController);
// reset password using otp as an token =>
authRouter.patch("/restPassword", resetController);

module.exports = authRouter;
 