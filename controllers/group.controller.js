const Group = require("../models/group.model");
const GroupMessage = require('../models/groupMessage.model')
const { getReceiverSocketId, io } = require("../lib/socket");

const createGroup = async (req, res) => {
    try {
        console.log('group create hit')
        const { name, profile_pic, members } = req.body;
        const creator_id = req.user._id;

        const allMembers = Array.from(new Set([creator_id, ...((members && Array.isArray(members)) ? members : [])]));

        const newGroup = new Group({
            creator_id,
            name,
            profile_pic: profile_pic || "",
            members: allMembers
        });

        await newGroup.save();

        // 5. Loop through all group members and emit message to online users
        for (const memberId of newGroup.members) {
            const receiverSocketId = getReceiverSocketId(memberId.toString());
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("newGroupCreated", { group: { _id: newGroup._id, name: newGroup.name, profile_pic: newGroup.profile_pic }, creator_id: newGroup.creator_id });
            }
        }

        res.status(201).json({
            success: true,
            message: "Group created successfully",
        });
    } catch (error) {
        console.error("Error in createGroup controller: ", error.message);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
const getGroups = async (req, res) => {
    const userId = req.user._id;
    try {
        const groups = await Group.find({
            $or: [
                { members: userId },
                { creator_id: userId }
            ]
        }).select("_id name profile_pic");

        const groupIds = groups.map(group => group._id);

        const unseenGroupChats = await GroupMessage.aggregate([
            { $match: { group_id: { $in: groupIds } } }, 
            { $match: { read_by: { $ne: userId } } },    
            { $group: { _id: "$group_id" } }               
        ]);

        const unseenGroupIds = unseenGroupChats.map(chat => chat._id);

        res.status(200).json({
            success: true,
            message: 'All the groups you have joined or created fetched successfully',
            groups,
            unseenGroupChats: unseenGroupIds 
        });
    } catch (error) {
        console.error("Error in getGroups controller: ", error.message);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

module.exports = {
    createGroup,
    getGroups
};
