const userRoutes = require("./routers/userRoutes");
const chatRoutes = require("./routers/chatRoutes");

function setup(app) {
  app.use("/api/users", userRoutes);
  app.use("/api/chatrooms", chatRoutes);
}

module.exports = setup;
