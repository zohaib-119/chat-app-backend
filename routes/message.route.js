const express = require("express");
const { addMessage, getMessages, markMessagesAsSeen } = require('../controllers/message.controller')
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/add-message", authMiddleware, addMessage);
router.get("/messages/:chatUserId", authMiddleware, getMessages);
router.put("/seen/:chatUserId", authMiddleware, markMessagesAsSeen);

module.exports = router;