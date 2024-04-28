const nodemailer = require("nodemailer")
const senderMail = "bw75596@gmail.com";

module.exports = nodemailer.createTransport({
   service:'gmail',
   auth: {
      user: senderMail,
      pass: 'riae lfkg elct wqjx'
   }
});

