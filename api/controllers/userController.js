const ResponseService = require("../../src/services/responseService");
const constants = require("../../src/utilities/constants");
const messages = require("../../src/utilities/messages");
const userValidation = require("../../src/validations/userValidations");
const userImplementation = require("../implementation/userImplementation");

class UserController {
  async signUp(req, res) {
    try {
      const data = req.body;
      const { error, value } = userValidation.signUp(data);
      if (error) {
        ResponseService.status = constants.CODE.BAD_REQUEST;
        return res
          .status(ResponseService.status)
          .send(
            ResponseService.responseService(
              constants.STATUS.ERROR,
              error.details[0].message,
              messages.INVALID_DATA
            )
          );
      }
      const response = await userImplementation.signUp(value);
      res.status(ResponseService.status).send(response);
    } catch (error) {
      ResponseService.status = constants.CODE.INTERNAL_SERVER_ERROR;
      return ResponseService.responseService(
        constants.STATUS.EXCEPTION,
        error.message,
        messages.EXCEPTION
      );
    }
  }

  async signIn(req, res) {
    try {
      const data = req.body;
      const { error, value } = userValidation.signIn(data);
      if (error) {
        ResponseService.status = constants.CODE.BAD_REQUEST;
        return res
          .status(ResponseService.status)
          .send(
            ResponseService.responseService(
              constants.STATUS.ERROR,
              error.details[0].message,
              messages.INVALID_DATA
            )
          );
      }
      const response = await userImplementation.signIn(value);
      res.status(ResponseService.status).send(response);
    } catch (error) {
      ResponseService.status = constants.CODE.INTERNAL_SERVER_ERROR;
      return ResponseService.responseService(
        constants.STATUS.EXCEPTION,
        error.message,
        messages.EXCEPTION
      );
    }
  }

  async verifyOTP(req, res) {
    try {
      const data = req.body;
      const { error, value } = userValidation.verifyOTP(data);
      if (error) {
        ResponseService.status = constants.CODE.BAD_REQUEST;
        return res
          .status(ResponseService.status)
          .send(
            ResponseService.responseService(
              constants.STATUS.ERROR,
              error.details[0].message,
              messages.INVALID_DATA
            )
          );
      }

      const email = value.email.toLowerCase();
      const otp = value.otp;

      const response = await userImplementation.verifyOTP(email, otp);
      res.status(ResponseService.status).send(response);
    } catch (error) {
      ResponseService.status = constants.CODE.INTERNAL_SERVER_ERROR;
      return ResponseService.responseService(
        constants.STATUS.EXCEPTION,
        error.message,
        messages.EXCEPTION
      );
    }
  }

  async profileEdit(req, res) {
    try {
      const data = req.body;
      const { error, value } = userValidation.profileEdit(data);
      if (error) {
        ResponseService.status = constants.CODE.BAD_REQUEST;
        return res
          .status(ResponseService.status)
          .send(
            ResponseService.responseService(
              constants.STATUS.ERROR,
              error.details[0].message,
              messages.INVALID_DATA
            )
          );
      }
      const response = await userImplementation.profileEdit(value);
      res.status(ResponseService.status).send(response);
    } catch (error) {
      ResponseService.status = constants.CODE.INTERNAL_SERVER_ERROR;
      return ResponseService.responseService(
        constants.STATUS.EXCEPTION,
        error.message,
        messages.EXCEPTION
      );
    }
  }

  async changePassword(req, res) {
    try {
      const data = req.body;
      const { error, value } = userValidation.changePassword(data);
      if (error) {
        ResponseService.status = constants.CODE.BAD_REQUEST;
        return res
          .status(ResponseService.status)
          .send(
            ResponseService.responseService(
              constants.STATUS.ERROR,
              error.details[0].message,
              messages.INVALID_DATA
            )
          );
      }
      const response = await userImplementation.changePassword(value);
      res.status(ResponseService.status).send(response);
    } catch (error) {
      ResponseService.status = constants.CODE.INTERNAL_SERVER_ERROR;
      return ResponseService.responseService(
        constants.STATUS.EXCEPTION,
        error.message,
        messages.EXCEPTION
      );
    }
  }

  async forgetPassword(req, res) {
    try {
      const data = req.body;
      const { error, value } = userValidation.forgetPassword(data);
      if (error) {
        ResponseService.status = constants.CODE.BAD_REQUEST;
        return res
          .status(ResponseService.status)
          .send(
            ResponseService.responseService(
              constants.STATUS.ERROR,
              error.details[0].message,
              messages.INVALID_DATA
            )
          );
      }
      const response = await userImplementation.forgetPassword(value);
      res.status(ResponseService.status).send(response);
    } catch (error) {
      ResponseService.status = constants.CODE.INTERNAL_SERVER_ERROR;
      return ResponseService.responseService(
        constants.STATUS.EXCEPTION,
        error.message,
        messages.EXCEPTION
      );
    }
  }

  async resetPassword(req, res) {
    try {
      const data = req.body;
      const { error, value } = userValidation.resetPassword(data);
      if (error) {
        ResponseService.status = constants.CODE.BAD_REQUEST;
        return res
          .status(ResponseService.status)
          .send(
            ResponseService.responseService(
              constants.STATUS.ERROR,
              error.details[0].message,
              messages.INVALID_DATA
            )
          );
      }
      const response = await userImplementation.resetPassword(value);
      res.status(ResponseService.status).send(response);
    } catch (error) {
      ResponseService.status = constants.CODE.INTERNAL_SERVER_ERROR;
      return ResponseService.responseService(
        constants.STATUS.EXCEPTION,
        error.message,
        messages.EXCEPTION
      );
    }
  }

  async signOut(req, res) {
    try {
      const userId = req.user.id;
      const response = await userImplementation.signOut(userId);
      res.status(ResponseService.status).send(response);
    } catch (error) {
      ResponseService.status = constants.CODE.INTERNAL_SERVER_ERROR;
      return ResponseService.responseService(
        constants.STATUS.EXCEPTION,
        error.message,
        messages.EXCEPTION
      );
    }
  }
}

module.exports = new UserController();
