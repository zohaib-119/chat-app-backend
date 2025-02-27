const mongoose = require("mongoose");

const ChannelMessageSchema = new mongoose.Schema({
    channel_id: { type: mongoose.Schema.Types.ObjectId, ref: "Channel", required: true }, 
    text: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("ChannelMessage", ChannelMessageSchema);
