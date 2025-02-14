const express = require("express");
const { signup, login, logout, updateProfile, checkAuth } = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.put("/update-profile", authMiddleware, updateProfile);
router.put("/check-auth", authMiddleware, checkAuth);

module.exports = router;