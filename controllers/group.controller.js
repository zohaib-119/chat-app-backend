const Group = require("../models/group.model");
const User = require("../models/user.model");

const createGroup = async (req, res) => {
    try {
        const { name, profile_pic } = req.body;
        const creator_id = req.user._id;

        const newGroup = new Group({
            creator_id,
            name,
            profile_pic: profile_pic || "",
            members: []
        });

        await newGroup.save();

        res.status(201).json({ success: true, message: "Group created successfully", group: newGroup });
    } catch (error) {
        console.log("Error in createGroup controller: ", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const joinGroup = async (req, res) => {
    const { groupId } = req.body;
    const userId = req.user._id;

    try {
        const group = await Group.findById(groupId);
        if (!group) return res.status(404).json({ success: false, message: "Group not found" });

        if (group.members.includes(userId)) {
            return res.status(400).json({ success: false, message: "User is already a member of this group" });
        }

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        group.members.push(userId);
        await group.save();

        res.status(200).json({ success: true, message: "User joined the group successfully" });
    } catch (error) {
        console.log("Error in joinGroup controller: ", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const leaveGroup = async (req, res) => {
    const { groupId } = req.body;
    const userId = req.user._id;

    try {
        const group = await Group.findById(groupId);
        if (!group) return res.status(404).json({ success: false, message: "Group not found" });

        if (!group.members.includes(userId)) {
            return res.status(400).json({ success: false, message: "User is not a member of this group" });
        }

        group.members = group.members.filter(member => member.toString() !== userId);
        await group.save();

        res.status(200).json({ success: true, message: "User left the group successfully" });
    } catch (error) {
        console.log("Error in leaveGroup controller: ", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const deleteGroup = async (req, res) => {
    const { groupId } = req.body;
    const userId = req.user._id

    try {
        const group = await Group.findById(groupId);
        if (!group) return res.status(404).json({ success: false, message: "Group not found" });

        if (group.creator_id.toString() !== userId) {
            return res.status(403).json({ success: false, message: "Only the creator can delete this group" });
        }

        await Group.findByIdAndDelete(groupId);

        res.status(200).json({ success: true, message: "Group deleted successfully" });
    } catch (error) {
        console.log("Error in deleteGroup controller: ", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const getJoinedGroups = async (req, res) => {
    const userId = req.user._id;
    try {
        // Find groups user is a member of
        const groups = await Group.find({ members: userId })
            .select("_id name profile_pic members");

        // Map the groups to include a total_members field
        const groupsWithCount = groups.map(group => {
            return {
                _id: group._id,
                name: group.name,
                profile_pic: group.profile_pic,
                total_members: group.members.length 
            };
        });

        res.status(200).json({
            success: true,
            message: 'All the groups you have joined fetched successfully',
            groups: groupsWithCount
        });
    } catch (error) {
        console.log("Error in getJoinedGroups controller: ", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const getCreatedGroups = async (req, res) => {
    const userId = req.user._id;  
    try {
        const groups = await Group.find({ creator_id: userId })
            .select("_id name profile_pic members");

        const groupsWithCount = groups.map(group => ({
            _id: group._id,
            name: group.name,
            profile_pic: group.profile_pic,
            total_members: group.members.length
        }));

        res.status(200).json({
            success: true,
            message: 'All groups you have created fetched successfully',
            groups: groupsWithCount
        });
    } catch (error) {
        console.log("Error in getCreatedGroups controller:", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const searchGroups = async (req, res) => {
    const { name } = req.query;  // Get search name from request query params

    try {
        if (!name) {
            return res.status(400).json({ success: false, message: "Search name is required" });
        }

        const groups = await Group.find({
            name: { $regex: name, $options: "i" }  // Case-insensitive regex search
        })
        .select("_id name profile_pic")
        .limit(5);

        res.status(200).json({
            success: true,
            message: 'Groups fetched successfully',
            groups
        });

    } catch (error) {
        console.log("Error in searchGroups controller:", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

module.exports = {
    createGroup,
    joinGroup,
    leaveGroup,
    deleteGroup,
    getJoinedGroups,
    getCreatedGroups,
    searchGroups,
};
