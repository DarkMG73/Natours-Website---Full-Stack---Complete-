const nodemailer = require('nodemailer');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Mike Glass <${process.env.EMAIL_FROM}>`;
  }

  createTransport() {
    if (
      process.env.NODE_ENV === 'production' ||
      process.env.NODE_ENV === 'production '
    ) {
      // Sendgrid
      return 1;
    }
      // Create a transporter (sends the email)
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
      // To make Gmail work, you must also
      // activate "less secure app" in Gmail
    });
  }
};
const sendEmail = async options => {
  // // 1) Create a transporter (sends the email)
  // const transport = nodemailer.createTransport({
  //   host: process.env.EMAIL_HOST,
  //   port: process.env.EMAIL_PORT,
  //   auth: {
  //     user: process.env.EMAIL_USERNAME,
  //     pass: process.env.EMAIL_PASSWORD
  //   }
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
