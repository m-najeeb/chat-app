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

  async updateUserPassword(email, newPassword) {
    return await UserSchema.findOneAndUpdate(
      { email: email },
      { $set: { password: newPassword } },
      { new: true }
    );
  }

  async getPaginatedUsers(skip, limit) {
    return await UserSchema.find().skip(skip).limit(limit);
  }

  async getUserCount() {
    return await UserSchema.countDocuments();
  }
}

module.exports = new UserQueries();
