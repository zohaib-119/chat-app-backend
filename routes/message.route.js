const express = require("express");
const { addMessage, deleteMessage, editMessage, getMessages } = require('../controllers/message.controller')
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/add-message", authMiddleware, addMessage);
router.get("/messages/:chatUserId", authMiddleware, getMessages);

module.exports = router;