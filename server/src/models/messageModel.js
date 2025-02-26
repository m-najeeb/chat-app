const mongoose = require("mongoose");
const timestamps = require("mongoose-timestamp");

const messageSchema = new mongoose.Schema({
  chatRoom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chats",
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

messageSchema.plugin(timestamps);

const MessageSchema = mongoose.model("Messages", messageSchema);
module.exports = { MessageSchema };
