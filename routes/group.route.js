const express = require("express");
const { createGroup, getGroups } = require("../controllers/group.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/create", authMiddleware, createGroup);
router.get("/get-groups", authMiddleware, getGroups);

module.exports = router;