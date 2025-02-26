const ResponseService = require("../../src/services/responseService");
const constants = require("../../src/utilities/constants");
const messages = require("../../src/utilities/messages");
const chatValidation = require("../../src/validations/chatValidations");
const chatImplementation = require("../implementation/chatImplementation");

class ChatController {
  async createChatRoom(req, res) {
    try {
      const data = req.body;
      const { error, value } = chatValidation.createChatRoom(data);
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
      const response = await chatImplementation.createChatRoom(
        value.name,
        value.participantIds
      );
      res.status(ResponseService.status).send(response);
    } catch (error) {
      ResponseService.status = constants.CODE.INTERNAL_SERVER_ERROR;
      return res
        .status(ResponseService.status)
        .send(
          ResponseService.responseService(
            constants.STATUS.EXCEPTION,
            error.message,
            messages.EXCEPTION
          )
        );
    }
  }

  async getChatRooms(req, res) {
    try {
      const userId = req.user.id;
      const response = await chatImplementation.getChatRooms(userId);
      res.status(ResponseService.status).send(response);
    } catch (error) {
      ResponseService.status = constants.CODE.INTERNAL_SERVER_ERROR;
      return res
        .status(ResponseService.status)
        .send(
          ResponseService.responseService(
            constants.STATUS.EXCEPTION,
            error.message,
            messages.EXCEPTION
          )
        );
    }
  }

  async getMessages(req, res) {
    try {
      const data = { roomId: req.params.roomId };
      const { error, value } = chatValidation.getMessages(data);
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
      const response = await chatImplementation.getMessages(value.roomId);
      res.status(ResponseService.status).send(response);
    } catch (error) {
      ResponseService.status = constants.CODE.INTERNAL_SERVER_ERROR;
      return res
        .status(ResponseService.status)
        .send(
          ResponseService.responseService(
            constants.STATUS.EXCEPTION,
            error.message,
            messages.EXCEPTION
          )
        );
    }
  }
}

module.exports = new ChatController();
