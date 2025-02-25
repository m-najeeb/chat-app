const userRoutes = require("./routers/userRoutes");
const messageRoutes = require("./routers/messageRoutes");

function setup(app) {
  app.use("/api/users", userRoutes);
  app.use("/api/messages", messageRoutes);
}

module.exports = setup;
