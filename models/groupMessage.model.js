const mongoose = require("mongoose");

const GroupMessageSchema = new mongoose.Schema({
    sender_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    group_id: { type: mongoose.Schema.Types.ObjectId, ref: "Group", required: true },
    text: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("GroupMessage", GroupMessageSchema);
