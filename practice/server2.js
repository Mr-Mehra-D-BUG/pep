const express = require("express");
const app = express();


// app.post("/sayhello" , function (req , res){
//   console.log("data", req.body); //output => data : undefined (without : app.use(express.json()));
//   res.end("this is from server");
// }); 


// ################################ with predefined middleware : app.use(express.json())); ##################################################################

// app.use(express.json());

// app.post("/sayhello2" , function(req , res){
//   console.log("data", req.body); //output : data { post: 'i am changed' }
//   res.end("this is from server");
// });




// ######################################################################################################################################//



// ##################################################  user defined middleware ########################################################

// app.use(function(req ,res){ // user defined middleware => this is user defined midlleware.
//     console.log("use will always run");
//   // req stucked here
// });

// app.post("/sayHi" , function(req , res){
//     console.log("this is from post server"); // this will not exicute . 

// });

// useing => next() in predefined milldleware.
app.use(function (req, res, next) {
  console.log("use will always run"); // output =>use will always run
  next(); // next send the control handler
});

app.post("/sayHi", function (req, res) {
  console.log("this is from post server"); // output :this is from post server
  res.end("this is from post server");
});





app.listen(3000, function () {
  console.log("server start at port 3000"); 
});