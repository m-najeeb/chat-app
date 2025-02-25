const mongoose = require("mongoose");
const timestamps = require("mongoose-timestamp");

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

messageSchema.plugin(timestamps);

const MessageSchema = mongoose.model("Messages", messageSchema);
module.exports = { MessageSchema };
