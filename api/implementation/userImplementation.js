const bcrypt = require("bcrypt");

const UserQueries = require("../../src/queries/userQueries");
const ResponseService = require("../../src/services/responseService");
const { sendOTP } = require("../../src/services/emailService");
const tokenService = require("../../src/services/tokenService");
const constants = require("../../src/utilities/constants");
const messages = require("../../src/utilities/messages");

class UserImplementation {
  async signUp(data) {
    try {
      const { username, email, phone } = data;
      const errorMessages = [];

      const existingUser = await UserQueries.getUserDetailsByData(data);

      if (existingUser) {
        if (existingUser.username === username)
          errorMessages.push(messages.USERNAME_EXISTS);
        if (existingUser.email === email)
          errorMessages.push(messages.EMAIL_EXISTS);
        if (existingUser.phone === phone)
          errorMessages.push(messages.PHONE_EXISTS);
      }

      if (errorMessages.length > 0) {
        ResponseService.status = constants.CODE.BAD_REQUEST;
        return ResponseService.responseService(
          constants.STATUS.ERROR,
          [],
          errorMessages
        );
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(data.password, salt);
      data.password = hashedPassword;

      const response = await UserQueries.createUser(data);

      if (response) {
        const otp = await sendOTP(email);
        ResponseService.status = constants.CODE.OK;
        return ResponseService.responseService(
          constants.STATUS.SUCCESS,
          response,
          messages.SUCCESSFULLY_SIGN_UP
        );
      }
    } catch (error) {
      ResponseService.status = constants.CODE.INTERNAL_SERVER_ERROR;
      return ResponseService.responseService(
        constants.STATUS.EXCEPTION,
        error.message,
        messages.EXCEPTION
      );
    }
  }

  async signIn(data) {
    try {
      const user = await UserQueries.getUserByEmail(data.email);

      if (!user) {
        ResponseService.status = constants.CODE.BAD_REQUEST;
        return ResponseService.responseService(
          constants.STATUS.ERROR,
          [],
          messages.USER_NOT_FOUND
        );
      }

      //! Not Sending OTP
      //   if (user.isEmailVerified === false) {
      //     const otp = await sendOTP(data.email);

      //     ResponseService.status = constants.CODE.NON_AUTHORITIVE_INFORMATION;
      //     return ResponseService.responseService(
      //       constants.STATUS.SUCCESS,
      //       null,
      //       messages.OTP_SENT
      //     );
      //   }

      const isMatch = await bcrypt.compare(data.password, user.password);

      if (!isMatch) {
        ResponseService.status = constants.CODE.BAD_REQUEST;
        return ResponseService.responseService(
          constants.STATUS.ERROR,
          [],
          messages.INVALID_CREDENTIALS
        );
      }

      const userData = { id: user._id, email: user.email };

      const accessToken = await tokenService.accessToken(userData);
      const refreshToken = await tokenService.refreshToken(user._id);
      user.isOnline = true;
      user.refreshToken = refreshToken;
      await user.save();

      ResponseService.status = constants.CODE.OK;
      return ResponseService.responseService(
        constants.STATUS.SUCCESS,
        { accessToken: accessToken, user: user },
        messages.RECORD_FOUND
      );
    } catch (error) {
      ResponseService.status = constants.CODE.INTERNAL_SERVER_ERROR;
      return ResponseService.responseService(
        constants.STATUS.EXCEPTION,
        error.message,
        messages.EXCEPTION
      );
    }
  }

  async verifyOTP(email, providedOtp) {
    try {
      const user = await UserQueries.getUserByEmail(email);

      if (!user) {
        ResponseService.status = constants.CODE.BAD_REQUEST;
        return ResponseService.responseService(
          constants.STATUS.ERROR,
          [],
          messages.USER_NOT_FOUND
        );
      }

      if (user.otp !== providedOtp) {
        ResponseService.status = constants.CODE.NOT_ACCEPTED;
        return ResponseService.responseService(
          constants.STATUS.ERROR,
          [],
          messages.INVALID_OTP
        );
      }

      const currentTime = new Date();
      if (currentTime > user.otpExpiration) {
        ResponseService.status = constants.CODE.NOT_ACCEPTED;
        return ResponseService.responseService(
          constants.STATUS.ERROR,
          [],
          messages.OTP_EXPIRED
        );
      }

      user.isEmailVerified = true;
      user.otp = null;
      user.otpExpiration = null;

      await user.save();

      ResponseService.status = constants.CODE.OK;
      return ResponseService.responseService(
        constants.STATUS.SUCCESS,
        [],
        messages.OTP_VERIFIED
      );
    } catch (error) {
      console.log(error);
      ResponseService.status = constants.CODE.INTERNAL_SERVER_ERROR;
      return ResponseService.responseService(
        constants.STATUS.EXCEPTION,
        error.message,
        messages.EXCEPTION
      );
    }
  }
}

module.exports = new UserImplementation();
