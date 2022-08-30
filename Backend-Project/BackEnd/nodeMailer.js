
const nodemailer = require("nodemailer");
const secret = require(".//secret");
// async..await is not allowed in global scope, must use a wrapper
async function mailSender() {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.ethereal.email",
    secure: true,
    auth: {
      user: secret.APP_EMAIL,
      pass: secret.APP_PASSWORD,
    },
  });
   const token = "Hello-world!";
  // send mail with defined transport object
  const objMsg = {
    from: '"OTP👻" <foo@example.com>', // sender address
    to: "dev.mehara97@gmail.com", // list of receivers
    subject: "Hello ✔", // Subject line
    html: `<p>HTML texting email for code <h1 style="color : red; ">${token}</h1></p>`, // html body
  };

  let info = await transporter.sendMail(objMsg);
}

mailSender()
.then(function(){
    console.log("mail send Successfully");
})
.catch(console.error);
