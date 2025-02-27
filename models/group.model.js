const mongoose = require("mongoose");

const GroupSchema = new mongoose.Schema({
    creator_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },  // Reference to the user who created the group
    name: { type: String, required: true },
    profile_pic: { type: String, default: "" },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]  // Array of user IDs who are members
}, { timestamps: true });

module.exports = mongoose.model("Group", GroupSchema);
