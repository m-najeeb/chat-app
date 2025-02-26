const { Server } = require("socket.io");
const { MessageSchema } = require("../models/messageModel");
const constants = require("../utilities/constants");
const messages = require("../utilities/messages");

class SocketService {
  constructor() {
    this.io = null;
    this.connectedUsers = {};
  }

  initializeSocket(server) {
    this.io = new Server(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT"],
        credentials: true,
      },
    });

    this.io.on("connection", (socket) => this.handleConnection(socket));
    console.log("Socket.IO initialized successfully");
  }

  handleConnection(socket) {
    console.log(`New socket connection established: ${socket.id}`);

    // Handle user authentication
    socket.on("authenticate", (userId) =>
      this.handleAuthentication(socket, userId)
    );

    // Handle joining a chat room
    socket.on("joinRoom", (roomId) => this.handleJoinRoom(socket, roomId));

    // Handle sending a message
    socket.on("sendMessage", (data) => this.handleSendMessage(socket, data));

    // Handle disconnection
    socket.on("disconnect", () => this.handleDisconnect(socket));
  }

  handleAuthentication(socket, userId) {
    if (!userId || !socket.id) {
      console.error("Authentication failed: userId or socket.id missing");
      socket.emit("error", {
        status: constants.STATUS.ERROR,
        message: messages.INVALID_DATA,
      });
      return;
    }

    this.connectedUsers[userId] = socket.id;
    console.log(`User ${userId} authenticated with socket ID: ${socket.id}`);
    socket.emit("authenticated", { message: "Authentication successful" });
  }

  handleJoinRoom(socket, roomId) {
    if (!roomId) {
      console.error("Join room failed: roomId missing");
      socket.emit("error", {
        status: constants.STATUS.ERROR,
        message: messages.INVALID_DATA,
      });
      return;
    }

    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);
    socket.emit("roomJoined", { roomId, message: `Joined room ${roomId}` });
  }

  async handleSendMessage(socket, data) {
    const { roomId, userId, content } = data;

    if (!roomId || !userId || !content) {
      console.error("Send message failed: missing required fields");
      socket.emit("error", {
        status: constants.STATUS.ERROR,
        message: messages.INVALID_DATA,
      });
      return;
    }

    try {
      const message = new MessageSchema({
        chatRoom: roomId,
        sender: userId,
        content,
      });
      await message.save();

      const messageData = {
        _id: message._id,
        chatRoom: roomId,
        sender: userId,
        content,
      };

      this.io.to(roomId).emit("newMessage", messageData);
      console.log(`Message sent to room ${roomId} by user ${userId}`);
    } catch (error) {
      console.error("Error saving message:", error.message);
      socket.emit("error", {
        status: constants.STATUS.EXCEPTION,
        message: messages.EXCEPTION,
      });
    }
  }

  handleDisconnect(socket) {
    console.log(`Client disconnected: ${socket.id}`);
    const userId = Object.keys(this.connectedUsers).find(
      (id) => this.connectedUsers[id] === socket.id
    );
    if (userId) {
      delete this.connectedUsers[userId];
      console.log(`User ${userId} disconnected`);
    }
  }

  getIo() {
    return this.io;
  }

  getConnectedUsers() {
    return this.connectedUsers;
  }
}

module.exports = new SocketService();
