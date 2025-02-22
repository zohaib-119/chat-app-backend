const mongoose = require("mongoose");

const GroupSchema = new mongoose.Schema({
    name: { type: String, required: true },
    profile_pic: { type: String, default: "" },
    creator_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

module.exports = mongoose.model("Group", GroupSchema);
