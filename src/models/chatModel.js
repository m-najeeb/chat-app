const mongoose = require("mongoose");
const timestamps = require("mongoose-timestamp");

const chatSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
  ],
});

chatSchema.plugin(timestamps);

const ChatSchema = mongoose.model("Chats", chatSchema);
module.exports = { ChatSchema };
