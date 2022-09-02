const nodemailer = require("nodemailer");
const password = require("./secrets")

async function mailSender(email,otp) {
  let testAccount = await nodemailer.createTestAccount();
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, 
    auth: {
      user: "tshivank620@gmail.com", 
      pass: password, 
    },
  });


  let info = await transporter.sendMail({
    from: '"Food App 👻" <foodApp@gmail.com>', 
    to: email, 
    subject: "Hello ✔ Request for password reset", 
    html: `<b>You OTP is ${otp}, OTP Expires in 5 min</b>`,
  });

  console.log("Message sent: %s", info.messageId);

  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

module.exports = mailSender;