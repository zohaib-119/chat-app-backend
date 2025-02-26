const express = require("express");
const { addMessage, deleteMessage, editMessage, getMessages } = require('../controllers/message.controller')
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/add-message", authMiddleware, addMessage);
router.put("/messages/:chatUserId", authMiddleware, getMessages);

module.exports = router;