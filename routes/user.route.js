const express = require("express");
const { getChatUsers, searchUsers } = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/get-chats",authMiddleware, getChatUsers);
router.get("/search",authMiddleware, searchUsers);

module.exports = router;