const { UserSchema } = require("../models/userModel");
// emailService.js
const nodemailer = require("nodemailer");
require("dotenv").config();

// Function to generate a random 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit OTP
};

// Create a transporter object using the SMTP settings
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // Use false for TLS (587), true for SSL (465)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false, // Allows using self-signed certificates if necessary
  },
});

// Function to send OTP via email
const sendOTP = async (toEmail) => {
  const otp = generateOTP(); // Generate the OTP

  const mailOptions = {
    from: `"${process.env.DISPLAY_NAME}" <${process.env.FROM_EMAIL}>`, // Sender address
    to: toEmail, // Recipient email address
    subject: "Your OTP Code",
    text: `Your OTP code is ${otp}. It will expire in 10 minutes.`,
    html: `<strong>Your OTP code is ${otp}. It will expire in 10 minutes.</strong>`,
  };

  try {
    const otpExpiration = new Date(Date.now() + 10 * 60 * 1000); // Set expiration to 10 minutes from now
    const info = await transporter.sendMail(mailOptions);
    const updatedUser = await UserSchema.findOneAndUpdate(
      { email: toEmail }, // Match the email
      {
        $set: {
          otp: otp, // Set the OTP
          otpExpiration: otpExpiration, // Set the expiration time
        },
      },
      { new: true } // Return the updated document
    );
    return otp; // You can store or verify this OTP on the server side
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw new Error("Failed to send OTP");
  }
};

module.exports = { sendOTP };
