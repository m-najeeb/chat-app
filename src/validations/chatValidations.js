const Joi = require("joi");

class ChatValidations {
  createChatRoom(data) {
    const schema = Joi.object({
      name: Joi.string().min(3).max(50).required(),
      participantIds: Joi.array()
        .items(Joi.string().hex().length(24))
        .min(2)
        .required(),
    });
    return schema.validate(data);
  }

  getMessages(data) {
    const schema = Joi.object({
      roomId: Joi.string().hex().length(24).required(),
    });
    return schema.validate(data);
  }
}

module.exports = new ChatValidations();
