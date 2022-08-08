const express = require("express");
const app = express();
// userModel with userSchema && and DataBase  Connection
const userModel = require("./userModel");
// npm install cookie-parser ( used for json web token )
const cookiePraser = require("cookie-parser");
// jwt ( for genrating token)
const jwt = require("jsonwebtoken");
// secret ki file importing
const secrets = require("./secret");
const secret = require("./secret");
const { model } = require("mongoose");
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
 // singnup and create documenet  at foodmodel 
app.post("/signup", async function (req, res) {
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
});

// log-in input => email + password
app.post("/login", async function (req, res) {
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
  } catch (error) {
    res.end(err.message);
  }
});

//users data => get all user data => sensitive data => add midlleware with in it => only loged in user get that data

app.get("/users", protectRoute, async function (req, res) {
  try {
    let users = await userModel.find();
    console.log(users);
    res.json(users); // to send json data
  } catch (error) {
    res.end(err.message);
  }
});

// get user data =>  who is loged in current time .

app.get("/user", protectRoute, async function (req, res) {
  try {
    // let data = req.body;
    // let { email } = data;
    // let user = await userModel.findOne({ email: email });   // using email id
    // let id = user["_id"];
    //  console.log(user);

    // req.userId object created by protectRout ( if any route change req object then that change occures for all route )
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
});


// as middleware for checking user verification. is user loged-in or not.  
function protectRoute(req, res, next) {
  try {
    const cookie = req.cookies; // cookie from client side
    const JWT = cookie.JWT; // getting JWT from cookie

    if (cookie.JWT) {
      console.log("protectRout Encounter");
      const token = jwt.verify(JWT, secrets.JWTSECRET); // verifying the token using secret key
      console.log("Deycrpted JWT", token);

      // req object changed with new prpoerty reqUserId
      const userID = token.data; // current users id from tokens payload section
      console.log(userID);
      req.userId = userID;

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


// forgot password =>

app.patch("/forgotPassword" , async function(req , res){
   try {
        let data = req.body;
        let { email } = data;
        let otp = generateOtp();
        let user = await userModel.findOneAndUpdate(
          { email: email },
          { otp: otp },
          { new: true }
        ); // email will find from FoodModel and update token(otp) at the document using {new: true}
        console.log(user);
        res.json({
          data: user,
          message: "otp has added at the document",
        });
   } catch (err) {
     res.end(err.message);
   }
});


// otp genrator function =>

function generateOtp(){
  let otp = Math.trunc(100000 +Math.random() * 900000);
  return otp;
}


// creating a server at port number 3000

app.listen(3000, function () {
  console.log("This is from Port 3000");
});
