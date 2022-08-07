const express = require("express");
const app = express();
// userModel with userSchema && and DataBase  Connection
const userModel = require("./userModel");
// npm install cookie-parser ( used for json web token )
const cookiePraser = require('cookie-parser');
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

   app.post('/signup' , async function(req ,res){
    try{ 
    let data = req.body;
    console.log(data);
    // create data in to database
  let newUser = await  userModel.create(data)
  console.log(newUser);
    res.end("data recived");
    } catch(err){
      res.end(err.message);
    }


   });


   // log-in input => email + password 
     app.post('/login' , async function(req , res){
    try{
         let data = req.body;
         let { email, password } = data;
         if(email&&password){
             let user  =await userModel.findOne({email : email});   // findOne() is a query for finding property 
             if(user){               // if with that email id user is available in server so do somthing else user need to signup first. 
                 if(user.password === password){
                   //create JWT ==>  paylod (_id) + secret key(secrets.JWTSECRET) + by dafault algo SHA256
                   const token = jwt.sign(
                     { data : user["_id"] , exp: Math.floor(Date.now() /1000) + (60 *60*24) }, // for the 24 hr valid only using that formula in it.
                     secrets.JWTSECRET,
                   );
                  
                   res.cookie("JWT", token); // res to clint with token inside the cookie
                   res.send("user loged in");
                 }
                 else{
                  res.send("Email and password does not matched");
                 }
             }
             else{
               res.send("user with this email id not found please signup first.");
             }
         }
         else{
          res.end("kindly enter email and password both");
         }


    }
    catch(error){
     res.end(err.message);
    }

})

app.post("/users" ,protectRoute, async function(req, res){
try {
     let data = req.body;
     let { email, password } = data;
     if(email&& password){
      let user  = await userModel.findOne({email : email});
      if(user){
        console.log(user);
        res.send("user found");
      }
     }
} catch (error) {
  res.send(error.message);
}


})

//user data => get all user data => sensitive data => add midlleware with in it => only loged in user get that data 

app.get('/user', protectRoute , async function(req , res){
  try {
      let users =  await userModel.find();
      console.log(users);
      res.json(users);  // to send json data

  } catch (error) {
    res.end(err.message);
  }
 
})

function protectRoute(req , res , next){
 try {
   const cookie = req.cookies; // cookie from client side
   const JWT = cookie.JWT; // getting JWT from cookie
  if (cookie.JWT) {
    console.log("protectRout Encounter");

    const token = jwt.verify(JWT, secrets.JWTSECRET);  // verifying the token using secret key
    console.log(token);
    
    // if you're loged in than you will go further function.
    next();
  }
  else{
     res.send("You are not loged in kindly loged in first.");
  }


 } catch (error) {
    if(error.message == "invalid signature") // if key not matched or token tamperd || or user not loged in
    {
      res.send("Kindly loged in first");
    }
    else{
      res.send(error.message)
    }
 }
}


// creating a server at port number 3000

app.listen(3000, function () {
  console.log("This is from Port 3000");
});
