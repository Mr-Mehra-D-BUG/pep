const express = require("express"); // rquiring express
const app = express(); // its mandetory to write

app.use(express.json());


app.get("/sayhello" , function(req , res){ // this function will invoke when /sayhello route will call
     // response goes to frontend
     console.log("data", req.body);
    res.end("hello from server")
})

app.get("/saybye", function(req , res){ // with route has a function for getting request and for response
    // response goes to fronend
    res.end("bye from Server")
})

// post resquest
app.post("/sayhello" , function(req ,res){
   console.log("data", req.body);
   res.end("This is from post server");

})
// tamplet route

app.get("/getsquare/:num1/:num2", function(req , res){
    console.log("header data", req.params.num1);
     console.log("header data" , req.params.num2);
     let num1 = req.params.num1 ;
     let num2 = req.params.num2;
      let square =  num1 * num2;
      res.end(" " + square);
})

// delete route
app.delete("/saydelete", function(req , res){
    console.log("data", req.body);
    res.end("this the response from delete route server");
})

// upadte route
app.patch("/sayUpdate", function(req,res){
    console.log("data", req.body);
    res.end("this is response from update route");
})


app.listen(8000 , function(){
    console.log("this is a server in port 8000");
});


//if server file is in same machine : loaclhost:8000
// http ports : ??