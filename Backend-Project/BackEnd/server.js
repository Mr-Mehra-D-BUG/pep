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
    let data = req.body;
    console.log(data);
    // create data in to database
  let newUser = await  userModel.create(data)
  console.log(newUser);
    res.end("data recived");
   })

   // log-in input => email + password 




// creating a server at port number 3000
app.listen(3000, function () {
  console.log("This is from Port 3000");
});
