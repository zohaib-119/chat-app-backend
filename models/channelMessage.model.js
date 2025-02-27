const mongoose = require("mongoose");

const GroupMessageSchema = new mongoose.Schema({
    group_id: { type: mongoose.Schema.Types.ObjectId, ref: "Group", required: true }, 
    sender_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
    read_by: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
}, { timestamps: true });

module.exports = mongoose.model("GroupMessage", GroupMessageSchema);
