const nodemailer = require('nodemailer');

const sendEmail = async options => {
  // 1) Create a transporter (sends the email)
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
    // To make Gmail work, you must also
    // activate "less secure app" in Gmail
  });

  // 2) Define the em,ail options
  const mailOptions = {
    from: 'Mike Glass <mike@glassinteractive.com>',
    to: options.email,
    subjet: options.subject,
    text: options.message
    // html: (if you want this)
  };

  // 3)Actually send the email
  await transport.sendMail(mailOptions);
};

module.exports = sendEmail;
