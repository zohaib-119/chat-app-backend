const express = require("express");
const { getChatUsers } = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/get-chats",authMiddleware, getChatUsers);

module.exports = router;