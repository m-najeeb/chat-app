const ChatQueries = require("../../src/queries/chatQueries");
const ResponseService = require("../../src/services/responseService");
const constants = require("../../src/utilities/constants");
const messages = require("../../src/utilities/messages");

class ChatImplementation {
  async createChatRoom(name, participantIds) {
    try {
      const chatRoom = await ChatQueries.createChatRoom({
        name,
        participants: participantIds,
      });
      ResponseService.status = constants.CODE.CREATED;
      return ResponseService.responseService(
        constants.STATUS.SUCCESS,
        { roomId: chatRoom._id },
        messages.CHAT_ROOM_CREATED
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

  async getChatRooms(userId) {
    try {
      const rooms = await ChatQueries.getChatRoomsByUserId(userId);
      ResponseService.status = constants.CODE.OK;
      return ResponseService.responseService(
        constants.STATUS.SUCCESS,
        rooms,
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

  async getMessages(roomId) {
    try {
      const chatRoom = await ChatQueries.getChatRoomById(roomId);
      if (!chatRoom) {
        ResponseService.status = constants.CODE.RECORD_NOT_FOUND;
        return ResponseService.responseService(
          constants.STATUS.ERROR,
          [],
          messages.CHAT_ROOM_NOT_FOUND
        );
      }
      const text = await ChatQueries.getMessagesByRoomId(roomId);
      ResponseService.status = constants.CODE.OK;
      return ResponseService.responseService(
        constants.STATUS.SUCCESS,
        text,
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
}

module.exports = new ChatImplementation();
