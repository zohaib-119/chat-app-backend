const express = require("express");
const { getGroupMessages, addGroupMessage, markGroupMessagesAsSeen } = require("../controllers/groupMessage.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/add-message", authMiddleware, addGroupMessage);
router.get("/get-messages/:groupId", authMiddleware, getGroupMessages);
router.put("/seen/:groupId", authMiddleware, markGroupMessagesAsSeen);

module.exports = router;