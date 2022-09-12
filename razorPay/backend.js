// steps :
 // generate pvt key and id for encryption paymnet detials and for verfictaion to the razorPay server
// create payment page :
// amount ,planName  from --> DB
// booking create : cretae

const express = require("express");
const app = express();
const shortId = require("shortid"); 
const Razorpay = require("razorpay");
const secret = require("./secret");


// pvt key || Id (public key)
const instance = new Razorpay({
  key_id: secret.Key_Id,
  key_secret: secret.Key_Secret,
});
// public folder files are used server at 3000 using express.static
app.use(express.static("public"));

// call get rrquest at checkout
app.get("/checkout", async function (req, res) {
  const currency = "INR";
  const amount = 50000;
  const planName = "MyfirstPlan";

  // razorpay instance will create and send this info to dashbord
  instance.orders.create({
    amount: amount,
    currency: currency,
    receipt: shortId.generate(), // genrating random receipt
    notes: {
      key1: planName,
    },
  });
  // after dashbord send res to clint 
  res.status(200).json({
    // values are defined already above
    currency: currency,
    amount: amount,
    product: planName,
  });
});
 const port  = process.env.PORT || 3000
app.listen(port, function(){
    console.log(`server started at ${port}`);
})

// verfication after payment from razorpay / address regiter at webhook local to gloabl address using ngrok
// req from razorPay webhooks :

app.post("/verification", (req, res) => {
  const secret = "ngrok"; // secret register at razorPay admin webhooks 

  console.log(req.body);
  // for encryption
  const shasum = crypto.createHmac("sha256", secret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");

  console.log(digest, req.headers["x-razorpay-signature"]);
  // response to clint =>
  if (digest === req.headers["x-razorpay-signature"]) {
    console.log("request is legit");
    res.status(200).json({
      message: "Payemnt succeed",
    });
  } else {
    res.status(403).json({ message: "Invalid" });
  }
});