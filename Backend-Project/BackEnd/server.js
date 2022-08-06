const express = require("express");
const app = express();
const userModel = require("./userModel");
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
app.post('/login' , function(req , res){
    try{
         let data = req.body;
         let {email,password} = data;
         if(email && password){
             let user  = userModel.findOne({email : email});   // findOne() is a query for finding property 
             if(user){  // if with that email id user is available in server so do somthing else user need to signup first. 
                 if(user.password === password){
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


// creating a server at port number 3000

app.listen(3000, function () {
  console.log("This is from Port 3000");
});
