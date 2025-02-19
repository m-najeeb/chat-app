const { UserSchema } = require("../models/userModel");

class UserQueries {
  async getUserDetailsByData(data) {
    return await UserSchema.findOne({
      $or: [
        { username: data.username },
        { email: data.email },
        { phone: data.phone },
      ],
    });
  }

  async createUser(data) {
    const user = new UserSchema(data);
    return await user.save();
  }

  async getUserByEmail(email) {
    return await UserSchema.findOne({ email });
  }

  async getUserDetailsById(id) {
    return await UserSchema.findOne({ _id: id });
  }
  async getUserById(id) {
    return await UserSchema.findById(id);
  }
}

module.exports = new UserQueries();
