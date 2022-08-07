const express = require("express");
const app = express();
// userModel with userSchema && and DataBase  Connection
const userModel = require("./userModel");
// npm install cookie-parser ( used for json web token )
const cookiePraser = require('cookie-parser');
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
             if(user){  // if with that email id user is available in server so do somthing else user need to signup first. 
                 if(user.password === password){
                  res.cookie('token',"sample value");
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


//user data => get all user data => sensitive data => add midlleware with in it => only loged in user get that data 

app.get('/user', protectRout , async function(req , res){
  try {
      let users =  await userModel.find();
      console.log(users);
      res.json(users);  // to send json data

  } catch (error) {
    res.end(err.message);
  }
 
})

function protectRout(req , res , next){
  console.log(req.cookie);
  console.log("protectRout Encounter");
  // if you're loged in than you will go further function.
  next();
}


// creating a server at port number 3000

app.listen(3000, function () {
  console.log("This is from Port 3000");
});
