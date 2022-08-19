// ############################################################ midlleware ###########################################################################
// midlleware are teh function to change req and res lifecycle.

// makeing a midlleware to check either req has data or not =>

const express = require("express");
const app = express();

app.use(express.json());
// user define midlle ware for post route => postRoute
app.post("/postRoute" , function(req , res ,next){
  let data = req.body;

  let length = Object.values(data).length;
  // Object.keys =>  [name, age , email]  retruns keys as array.
  if (length == 0) {
    res.end("enter the data at post body");
  } else {
    next();
  }
})
app.post("/postRoute" , function(req , res){
  console.log("data", req.body);
  res.end("your data is sucessfully recived .this is from post server"); // output : your data is sucessfully recived .this is from post server
});


app.listen(3000, function () {
  console.log("server start at port 3000");
});