const Channel = require("../models/Channel");
const User = require("../models/User");

const createChannel = async (req, res) => {
    try {
        const { name, profile_pic } = req.body;
        const creator_id = req.user._id;

        const newChannel = new Channel({
            creator_id,
            name,
            profile_pic: profile_pic || "",
            members: []
        });

        await newChannel.save();

        res.status(201).json({ success: true, message: "Channel created successfully", channel: newChannel });
    } catch (error) {
        console.log("Error in createChannel controller: ", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const joinChannel = async (req, res) => {
    const { channelId } = req.body;
    const userId = req.user._id;

    try {
        const channel = await Channel.findById(channelId);
        if (!channel) return res.status(404).json({ success: false, message: "Channel not found" });

        if (channel.members.includes(userId)) {
            return res.status(400).json({ success: false, message: "User is already a member of this channel" });
        }

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        channel.members.push(userId);
        await channel.save();

        res.status(200).json({ success: true, message: "User joined the channel successfully" });
    } catch (error) {
        console.log("Error in joinChannel controller: ", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const leaveChannel = async (req, res) => {
    const { channelId } = req.body;
    const userId = req.user._id;

    try {
        const channel = await Channel.findById(channelId);
        if (!channel) return res.status(404).json({ success: false, message: "Channel not found" });

        if (!channel.members.includes(userId)) {
            return res.status(400).json({ success: false, message: "User is not a member of this channel" });
        }

        channel.members = channel.members.filter(member => member.toString() !== userId);
        await channel.save();

        res.status(200).json({ success: true, message: "User left the channel successfully" });
    } catch (error) {
        console.log("Error in leaveChannel controller: ", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const deleteChannel = async (req, res) => {
    const { channelId } = req.body;
    const userId = req.user._id

    try {
        const channel = await Channel.findById(channelId);
        if (!channel) return res.status(404).json({ success: false, message: "Channel not found" });

        if (channel.creator_id.toString() !== userId) {
            return res.status(403).json({ success: false, message: "Only the creator can delete this channel" });
        }

        await Channel.findByIdAndDelete(channelId);

        res.status(200).json({ success: true, message: "Channel deleted successfully" });
    } catch (error) {
        console.log("Error in deleteChannel controller: ", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

module.exports = {
    createChannel,
    joinChannel,
    leaveChannel,
    deleteChannel
};
