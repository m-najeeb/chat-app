const mongoose = require("mongoose");
const timestamps = require("mongoose-timestamp");

const userSchema = new mongoose.Schema({
  profilePicture: {
    type: String,
  },
  fullName: {
    type: String,
  },
  username: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  country: {
    type: String,
  },
  password: {
    type: String,
  },
  otp: {
    type: String,
    expires: "10m",
  },
  otpExpiration: {
    type: Date,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  refreshToken: {
    type: String,
  },
});

userSchema.plugin(timestamps);

const UserSchema = mongoose.model("Users", userSchema);
module.exports = { UserSchema };
