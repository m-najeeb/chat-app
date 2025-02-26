const { ChatSchema } = require("../models/chatModel");
const { MessageSchema } = require("../models/messageModel");

class ChatQueries {
  async createChatRoom(data) {
    return await ChatSchema.create(data);
  }

  async getChatRoomsByUserId(userId) {
    return await ChatSchema.find({ participants: userId }).populate(
      "participants",
      "username"
    );
  }

  async getMessagesByRoomId(roomId) {
    return await MessageSchema.find({ chatRoom: roomId })
      .populate("sender", "username")
      .sort({ createdAt: 1 });
  }

  async getChatRoomById(roomId) {
    return await ChatSchema.findById(roomId);
  }
}

module.exports = new ChatQueries();
