const Group = require("../models/group.model");
const GroupMessage = require("../models/groupMessage.model");
const { getReceiverSocketId, io } = require("../lib/socket");

// GET group messages + group info
const getGroupMessages = async (req, res) => {
    console.log('getGroupMessages hit')
    try {
        const { groupId } = req.params;
        const userId = req.user._id;  // Assuming you have a user object injected via auth middleware

        // 1. Find the group
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ success: false, message: "Group not found" });
        }

        // 2. Check if user is a member
        if (!group.members.includes(userId)) {
            return res.status(403).json({ success: false, message: "You are not a member of this group" });
        }

        // 3. Load messages with sender info
        const messages = await GroupMessage.find({ group_id: groupId })
            .populate({
                path: "sender_id",
                select: "_id username"  // Only show _id and username of sender
            })
            .sort({ createdAt: 1 });  // oldest to newest

        // 4. Return group info and messages
        return res.json({
            success: true,
            message: 'Group Messages fetched successfully',
            group: {
                _id: group._id,
                name: group.name,
                profile_pic: group.profile_pic
            },
            chatMessages: messages.map(message => ({
                _id: message._id,
                text: message.text,
                createdAt: message.createdAt,
                sender: message.sender_id  // populated sender
            }))
        });

    } catch (error) {
        console.log("Error in getGroupMessages: ", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const addGroupMessage = async (req, res) => {
    console.log('addGroupMessage hit');
    try {
        const { text, groupId } = req.body;
        const userId = req.user._id;  // Auth middleware must set req.user

        // 1. Find the group
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ success: false, message: "Group not found" });
        }

        // 2. Check if user is a member
        if (!group.members.includes(userId)) {
            return res.status(403).json({ success: false, message: "You are not a member of this group" });
        }

        // 3. Create and save new message
        const newMessage = new GroupMessage({
            group_id: groupId,
            sender_id: userId,
            text,
        });

        await newMessage.save();

        // 4. Populate sender for frontend
        const populatedMessage = await GroupMessage.findById(newMessage._id)
            .populate({
                path: "sender_id",
                select: "_id username"
            });

        const messageData = {
            newMessage: {
                _id: populatedMessage._id,
                text: populatedMessage.text,
                createdAt: populatedMessage.createdAt,
                sender: populatedMessage.sender_id
            },
            groupId
        };

        // 5. Loop through all group members and emit message to online users
        for (const memberId of group.members) {
            const receiverSocketId = getReceiverSocketId(memberId.toString());
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("newGroupMessage", messageData);
            }
        }

        // 6. Return response to sender
        return res.status(201).json({
            success: true,
            message: "Message sent",
            newMessage: messageData.newMessage
        });

    } catch (error) {
        console.log("Error in addGroupMessage: ", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};


module.exports = {
    getGroupMessages,
    addGroupMessage
};
