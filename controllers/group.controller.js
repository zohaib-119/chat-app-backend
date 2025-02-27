const Group = require("../models/group.model");

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

        res.status(201).json({ 
            success: true, 
            message: "Group created successfully", 
            group: newGroup 
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
        // Find groups where user is a member OR creator
        const groups = await Group.find({
            $or: [
                { members: userId },
                { creator_id: userId }
            ]
        }).select("_id name profile_pic");

        res.status(200).json({
            success: true,
            message: 'All the groups you have joined or created fetched successfully',
            groups
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
