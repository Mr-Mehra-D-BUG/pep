
const nodemailer = require("nodemailer");
const secret = require("../secret");
async function mailSender(email , token) {
  console.log(email);
  let transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.ethereal.email",
    secure: true,
    auth: {
      user: secret.APP_EMAIL,
      pass: secret.APP_PASSWORD,
    },
  });
 
  // send mail with defined transport object
  const objMsg = {
    from: '"cult fit Clone" <foo@example.com>', // sender address
    to: email, // list of receivers
    subject: "Hello ✔ rest password token", // Subject line
    html: `<p> Otp <h1 style="color : red; ">${token}</h1></p>`, // html body
  };

  let info = await transporter.sendMail(objMsg);
}

// calling from forgotPassword manually 
// mailSender(email,token)
// .then(function(){
//     console.log("mail send Successfully");
// })
// .catch(console.error);

module.exports = mailSender;