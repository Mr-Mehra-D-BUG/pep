const express = require("express");
const app = express();
const userRouter = require("./routes/userRoutes");
const authRouter = require("./routes/authRoutes");

// userModel with userSchema && and DataBase  Connection
const userModel = require("./Model/userModel");
// npm install cookie-parser ( used for json web token )
const cookiePraser = require("cookie-parser");

const { model } = require("mongoose");
app.use(express.json());
app.use(cookiePraser());
// for authentiction routes like login signup.
app.use("/api/v1/auth", authRouter);
// for user accesse part eg profile and users data
app.use("/api/v1/user", userRouter);


// creating a server at port number 3000
app.listen(3000, function () {
  console.log("This is from Port 3000");
});
