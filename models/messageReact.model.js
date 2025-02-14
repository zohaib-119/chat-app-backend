const mongoose = require("mongoose");

const MessageReactSchema = new mongoose.Schema({
    group_message_id: { type: mongoose.Schema.Types.ObjectId, ref: "GroupMessage", required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    react: { type: String, enum: ["like", "love", "haha", "wow", "sad", "angry"], required: true }
}, { timestamps: true });

module.exports = mongoose.model("MessageReact", MessageReactSchema);
