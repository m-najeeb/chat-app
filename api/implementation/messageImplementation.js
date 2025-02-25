const MessageQueries = require("../../src/queries/messageQueries");
const ResponseService = require("../../src/services/responseService");
const tokenService = require("../../src/services/tokenService");
const constants = require("../../src/utilities/constants");
const messages = require("../../src/utilities/messages");

class MessageImplementation {
  async sendMessage(data) {
    try {
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

module.exports = new MessageImplementation();
