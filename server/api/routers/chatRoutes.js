const { Router } = require("express");
const chatController = require("../controllers/chatController");
const verifyToken = require("../../src/middleware/verifyToken");

const router = Router();

router.post("/", verifyToken, chatController.createChatRoom);
router.get("/", verifyToken, chatController.getChatRooms);
router.get("/messages/:roomId", verifyToken, chatController.getMessages);

module.exports = router;
