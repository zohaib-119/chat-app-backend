const User = require("../models/user.model");
const Message = require("../models/message.model");

const getChatUsers = async (req, res) => {
    try {
        const userId = req.user._id;

        // Get all the users with whom the logged in user has chatted
        const chatUsers = await Message.aggregate([
            {
                $match: {
                    $or: [{ sender_id: userId }, { receiver_id: userId }]
                }
            },
            {
                $group: {
                    _id: null,
                    uniqueUsers: {
                        $addToSet: "$sender_id"
                    },
                    uniqueReceivers: {
                        $addToSet: "$receiver_id"
                    }
                }
            },
            {
                $project: {
                    allUsers: {
                        $setUnion: ["$uniqueUsers", "$uniqueReceivers"]
                    }
                }
            }
        ]);

        // Extract user IDs and filter out the logged-in user
        const userIds = chatUsers.length ? chatUsers[0].allUsers.filter(id => id.toString() !== userId.toString()) : [];

        // Fetch user details
        const users = await User.find({ _id: { $in: userIds } }).select("_id username profile_pic");

        // Find user IDs with unseen messages
        const unseenChats = await Message.distinct("sender_id", { receiver_id: userId, is_seen: false });

        res.status(200).json({ success: true, message: 'Chats fetched successfully', chatUsers: users, unseenChats, currentChats: userIds });
    } catch (error) {
        console.log("Error in getChatUsers: ", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const searchUsers = async (req, res) => {
    try {
        console.log('hit')
        const { username } = req.query;
        const userId = req.user._id;
        if (!username) {
            return res.status(400).json({ message: "Username parameter is required" });
        }

        const users = await User.find({ username: { $regex: username, $options: "i" }, _id: { $ne: userId } })
            .limit(5)
            .select("_id username profile_pic");

        res.status(200).json({ success: true, message: 'Users fetched successfully', users });
    } catch (error) {
        console.log("Error in searchUsers: ", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

module.exports = { getChatUsers, searchUsers };
