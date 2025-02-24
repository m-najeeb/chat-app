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

  async getUsersByPagination(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [users, totalRecords] = await Promise.all([
      UserSchema.find({}).skip(skip).limit(limit).lean(),
      UserSchema.countDocuments(),
    ]);

    return {
      users,
      totalPages: Math.ceil(totalRecords / limit),
      currentPage: page,
      totalRecords,
    };
  }
}

module.exports = new UserQueries();
