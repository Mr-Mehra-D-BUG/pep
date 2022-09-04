const userModel = require("../Model/userModel");
// jwt ( for genrating token)
const jwt = require("jsonwebtoken");
// secret key file importing
const secrets = require("../secret");
const secret = require("../secret");
const nodemailer = require("../utilities/nodemailer");

// ******************************** controller function ****************************\\

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

async function signupController(req, res) {
  try {
    let data = req.body;

    // create data in to database
    let newUser = await userModel.create(data);
    console.log(newUser);
    res.status(201).json({
      result: "user singned up",
    });
  } catch (err) {
    res.status(400).json({
      result: err.message,
    });
  }
}

async function loginController(req, res) {
  try {
    let data = req.body;
    let { email, password } = data;

    if (email && password) {
      let user = await userModel.findOne({ email: email }); // findOne() is a query for finding documenet

      if (user) {
        // if with that email id user is available in server so do somthing else user need to signup first.
        if (user.password === password) {
          //create JWT ==>  paylod (_id) + secret key(secrets.JWTSECRET) + by dafault algo SHA256

          const token = jwt.sign(
            {
              data: user["_id"],
              exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
            },
            secrets.JWTSECRET // for the 24 hr valid only using that formula in it.
          );

          res.cookie("JWT", token); // res to clint with token inside the cookie
          user.password = undefined;
          user.ConfirmPassword = undefined;
          res.status(200).json({
            user,
          });
        } else {
          // 1 status code
          res.status(400).json({
            result: "password does not matched",
          });
        }
      } else {
        // send status code instead of res.send(msg);
        // 2nd status code when user not found

        res.status(404).json({
          result: "user not found",
        });
      }
    } else {
      // 3rd status code when somthing wrong or missing.
      res.status(400).json({
        result: "user not found kindly signup",
      });
    }
  } catch (err) {
    // res.end(err.message);
    // when server crashed code 500
    res.status(500).json({
      result: err.message,
    });
  }
}

async function forgotPasswordController(req, res) {
  try {
    const data = req.body;
    const { email } = data;
    let user = await userModel.findOne({ email });
    // console.log(user);
    if (user) {
      const FiveMinute = Date.now() + 5 * 60 * 1000;
      let otp = generateOtp();

      nodemailer(email, otp);
      user.otp = otp;
      user.otpExpiry = FiveMinute;

      await user.save();

      res.status(201).json({
        data: user,
        result: "otp sended in your email",
      });
    } else {
      res.status(404).json({
        result: "user not found please signup first",
      });
    }
  } catch (err) {
    res.end(err.message);
  }
}

// let user = await userModel.findOneAndUpdate(
//   { email: email },
//   { otp: otp, otpExpiry: FiveMinute },
//   { new: true }
// ); // email will find from FoodModel and update token(otp) at the document using {new: true}

async function resetController(req, res) {
  try {
    let data = req.body;
    // console.log(data);
    let { otp, password, ConfirmPassword, email } = data;
    let user = await userModel.findOne({ email });
    // console.log(user);
    // get current time
    const currTime = Date.now();
    // otp expriy time durtaion. from user Data
    let givenTime = user.otpExpiry;
    console.log(givenTime, currTime); //  comparsion among given time and curr time
    if (currTime > givenTime) {
      // delete otp and otpExpiry from dataBase
      user.otp = undefined; //    delete user.otp;
      user.otpExpiry = undefined; //      delete user.otpExpiry;
      console.log(user.otpExpiry); // user.save() upadte all changes into the dataBase as well
      console.log(user.otp); // user.save() upadte all changes into the dataBase as well
      await user.save();

      res.status(200).json({
        result: "Otp Expired ",
      });
      console.log(user, "from");
    } else {
      //  when time and otp is under protocol .
      // check otp and given otp is matched or not. it may be from diifrent user otp.
      if (user.otp != otp) {
        console.log(user);
        res.status(200).json({
          result: "wrong otp",
        });
      } else {
        console.log(user.otp);
        user = await userModel.findOneAndUpdate(
          { otp }, // find
          { password, ConfirmPassword }, // update
          { runValidators: true, new: true } // default validator not working without {runValidators : true} eg: confirm pass won't match because validator not come into action with this .
        );
        user.otp = undefined; // delete otp and otpExpiry from DataBase
        user.otpExpiry = undefined;
        // save the update.
        await user.save();
        res.status(201).json({
          user: user,
          message: "user password reset",
        });
      }
    }
  } catch (err) {
    res.status(500).json({
      result: err.message,
    });
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

module.exports = {
  signupController,
  loginController,
  forgotPasswordController,
  resetController,
  protectRoute,
};

//************ Helper Function **********************/
// otp genrator function for forgot password =>
function generateOtp() {
  const otp = Math.trunc(100000 + Math.random() * 900000); // six digit number 1-9
  return otp;
}
