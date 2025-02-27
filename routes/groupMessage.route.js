const express = require("express");
const { getGroupMessages, addGroupMessage } = require("../controllers/groupMessage.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/add-message", authMiddleware, addGroupMessage);
router.get("/get-messages/:groupId", authMiddleware, getGroupMessages);

module.exports = router;