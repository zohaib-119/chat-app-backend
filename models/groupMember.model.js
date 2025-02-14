const mongoose = require("mongoose");

const GroupMemberSchema = new mongoose.Schema({
    group_id: { type: mongoose.Schema.Types.ObjectId, ref: "Group", required: true },
    member_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

module.exports = mongoose.model("GroupMember", GroupMemberSchema);
