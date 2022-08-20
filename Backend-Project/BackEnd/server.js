const express = require("express");
const app = express();
// userModel with userSchema && and DataBase  Connection
const userModel = require("./userModel");
// npm install cookie-parser ( used for json web token )
const cookiePraser = require("cookie-parser");
// jwt ( for genrating token)
const jwt = require("jsonwebtoken");
// secret key file importing
const secrets = require("./secret");
const secret = require("./secret");
const { model } = require("mongoose");
//using Router() function for reducing route path =>
// for authentiction routes like login signup.
// const AuthRoute = express.Router();
// // for user accesse part eg profile and
// const userRoute = express.Router();

// sign up =>
/* input :
   name,
   password
   confirm -password,
   Address,
   Email,
   Phone Number ,
   Pic,

   */

app.use(express.json());
app.use(cookiePraser());

//setting routers name. 

// singnup and create document  at foodmodel
app.post("/signup", signupController);

// log-in input => email + password
app.post("/login", loginController);

//users data => get all user data => sensitive data => add midlleware with in it => only loged in user get that data
app.get("/users", protectRoute, getAlluserController);

// get user data =>  who is loged in current time .
 app.get("/user", protectRoute, profileController);


// forgot password =>
app.patch("/forgotPassword", forgotPasswordController);

// reset password using otp as an token =>
app.patch("/restPassword", resetController);


// otp genrator function for forgot password =>
function generateOtp() {
  const otp = Math.trunc(100000 + Math.random() * 900000); // six digit number 1-9
  return otp;
}





// creating a server at port number 3000
app.listen(3000, function () {
  console.log("This is from Port 3000");
});

// ********************************controller function ****************************\\
async function signupController(req, res) {
  try {
    let data = req.body;
    console.log(data);
    // create data in to database
    let newUser = await userModel.create(data);
    console.log(newUser);
    res.end("data recived");
  } catch (err) {
    res.end(err.message);
  }
}

async function loginController(req, res) {
  try {
    let data = req.body;
    let { email, password } = data;

    if (email && password) {
      let user = await userModel.findOne({ email: email }); // findOne() is a query for finding property

      if (user) {
        // if with that email id user is available in server so do somthing else user need to signup first.
        if (user.password === password) {
          //create JWT ==>  paylod (_id) + secret key(secrets.JWTSECRET) + by dafault algo SHA256

          const token = jwt.sign(
            {
              data: user["_id"],
              exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
            }, // for the 24 hr valid only using that formula in it.
            secrets.JWTSECRET
          );

          res.cookie("JWT", token); // res to clint with token inside the cookie
          res.send("user loged in");
        } else {
          res.send("Email and password does not matched");
        }
      } else {
        res.send("user with this email id not found please signup first.");
      }
    } else {
      res.end("kindly enter email and password both");
    }
  } catch (err) {
    res.end(err.message);
  }
}

async function forgotPasswordController(req, res) {
  try {
    let data = req.body;

    let { email } = data;
    // let test = await userModel.findOne(email);
    // console.log(test);
    let FiveMinute = Date.now() + 5 * 60 * 1000;
    console.log(Date.now());
    let otp = generateOtp();
    let user = await userModel.findOneAndUpdate(
      { email: email },
      { otp: otp, otpExpiry: FiveMinute },
      { new: true }
    ); // email will find from FoodModel and update token(otp) at the document using {new: true}
    console.log(user);
    res.json({
      data: user,
      message: "otp send to your mail",
    });
  } catch (err) {
    res.end(err.message);
  }
}

async function profileController(req, res) {
  try {
    // let data = req.body;
    // let { email } = data;
    // let user = await userModel.findOne({ email: email });   // using email id
    // let id = user["_id"];
    //  console.log(user);

    // req.userId object created by protectRout ( if any route change in req object then that change will occures for all route )
    const id = req.userId;
    let user = await userModel.findById(id); // finding user by using id of user
    console.log(user);

    res.send({
      data: user,
      message: "This the user who loged in.",
    });
  } catch (error) {
    res.send(error.message);
  }
}

async function getAlluserController(req, res) {
  try {
    let users = await userModel.find();
    // console.log(users);
    res.json(users); // to send json data
  } catch (error) {
    res.end(err.message);
  }
}

async function resetController(req, res) {
  try {
    let data = req.body;
    let { otp, password, ConfirmPassword, email } = data;

    let user = await userModel.findOne({ email });
    console.log(user);

    // getting current time for comperison
    const currTime = Date.now();
    // getting otp exprie time durtaion given to user from document.
    let givenTime = user.otpExpiry;

    // check when time limit exeed then remove the otp and otpExpiry from user document.
    if (currTime > givenTime) {
      // expire the otp , delete from  user document
      user.otp = undefined;

      /*
      also write like that =>
        delete user.otp;
       delete user.otpExpiry;

      */
      // and also otpExpiry
      user.otpExpiry = undefined;
      // all code above and changes occures in express server code base it will not update for data base.. for that user.save() used
      // user.save() reponsible for update in server whatever change occures users document in api server.hence without this confirm pass and pass not matched
      await user.save();
      // res to user
      res.json({
        data: user,
        message: "otp is Exipred please try again",
      });
    }

    // check when time and otp is under protocol .
    else {
      // check otp and given otp is matched or not. it may from diifrent user otp. with under time limit
      if (user.otp != otp) {
        res.json({
          message: "otp dose not match",
        });
      } else {
        // find with otp and update pass and confirm pass
        user = await userModel.findOneAndUpdate(
          { otp }, // find
          { password, ConfirmPassword }, // pass and confirm pass added
          // {new : true } add new value in document
          { runValidators: true, new: true } // default validator not working without {runValidators : true} eg: confirm pass won't match because validator not come into action with this .
        );

        // Delete key from DB  => get otp key and delete becasue there is no use of that after new password update.
        user.otp = undefined;
        // save all the update in to the document in to DB
        user.otpExpiry = undefined;
        // save the update.
        await user.save();
        // response to the user.
        res.json({
          data: user,
          message: "Password is Succesfully Reset",
        });
      }
    }
  } catch (err) {
    res.send(err.message);
  }
}
// as middleware for checking user verification. is user loged-in or not.
function protectRoute(req, res, next) {
  try {
    const cookie = req.cookies; // cookie from client side
    const JWT = cookie.JWT; // getting JWT from cookie

    if (JWT) {
      console.log("protectRout Encounter");
      const token = jwt.verify(JWT, secrets.JWTSECRET); // verifying the token using secret key
      console.log("Deycrpted JWT", token);

      // req object changed with new prpoerty reqUserId
      const userID = token.data; // current users id from tokens payload section
      console.log(userID);
      req.userId = userID; // new property for req.userId = userID

      // if you're loged in than you will go next handle.
      next();
    } else {
      res.send("You are not loged in kindly loged in first.");
    }
  } catch (error) {
    if (error.message == "invalid signature") {
      // if key not matched or token tamperd || or user not loged in
      res.send("Kindly loged in first");
    } else {
      res.send(error.message);
    }
  }
}