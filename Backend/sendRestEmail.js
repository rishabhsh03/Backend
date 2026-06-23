const transporter = require("../mail");

const sendResetEmail = async (email, resetToken) => {
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: email,
    subject: "Password Reset",
    html: `
      <h2>Password Reset</h2>
      <p>Your token:</p>
      <b>${resetToken}</b>
    `,
  });
};

module.exports = sendResetEmail;