const userModel = require("../Model/userModel");
// jwt ( for genrating token)
const jwt = require("jsonwebtoken");
// secret key file importing
const secrets = require("../secret");
const secret = require("../secret");
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
            },
            secrets.JWTSECRET // for the 24 hr valid only using that formula in it.
          );

          res.cookie("JWT", token); // res to clint with token inside the cookie
          user.password = undefined;
          user.ConfirmPassword = undefined;
          res.status(200).json({
            user
          });

        } else {
          // 1 status code
         res.status(400).json({
          result: "password does not matched"
         })
        }
      } else {
      // send status code instead of res.send(msg);
      // 2nd status code when user not found
    
       res.status(404).json({
        result: "user not found"
      });

      }
    } else {
      // 3rd status code when somthing wrong or missing. 
      res.status(400).json({
        result: "user not found kindly signup"
      })

    }
  } catch (err) {
    // res.end(err.message);
    // when server crashed code 500
     res.status(500).json({
      result : err.message
    })
  }
}

async function forgotPasswordController(req, res) {
  try {
    let data = req.body;

    let { email } = data;
    
    let FiveMinute = Date.now() + 5 * 60 * 1000;
    let otp = generateOtp();
    let user = await userModel.findOneAndUpdate(
      { email: email },
      { otp: otp, otpExpiry: FiveMinute },
      { new: true }
    ); // email will find from FoodModel and update token(otp) at the document using {new: true}
  
    res.json({
      data: user,
      message: "otp send to your mail",
    });
  } catch (err) {
    res.end(err.message);
  }
}



async function resetController(req, res) {
  try {
    let data = req.body;
    let { otp, password, ConfirmPassword, email } = data;

    let user = await userModel.findOne({ email });

    // store current time for comperison
    const currTime = Date.now();
    // getting otp expriy time durtaion given to user from document.
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
