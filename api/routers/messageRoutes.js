const { Router } = require("express");
const messageController = require("../controllers/messageController");
const verifyToken = require("../../src/middleware/verifyToken");

const router = Router();

router.post("/send-message", verifyToken, messageController.sendMessage);

module.exports = router;
