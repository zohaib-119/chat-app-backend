const Message = require("../models/message.model");
const { getReceiverSocketId } = require("../lib/socket");

// Add a new message
const addMessage = async (req, res) => {
    try {
        const { receiver_id, text } = req.body;
        const sender_id = req.user._id;

        const message = new Message({ sender_id, receiver_id, text });
        await message.save();

        const receiverSocketId = getReceiverSocketId(receiver_id);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", message);
        }

        res.status(201).json({ success: true, message: "Message is sent successfully", data: message });
    } catch (error) {
        console.log("Error in add message controller: ", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Get latest 15 messages for a specific chat with pagination
const getMessages = async (req, res) => {
    try {
        const { chatUserId } = req.params;
        const { page = 1 } = req.query;
        const limit = 15;
        const skip = (page - 1) * limit;

        const messages = await Message.find({
            $or: [
                { sender_id: req.user._id, receiver_id: chatUserId },
                { sender_id: chatUserId, receiver_id: req.user_.id }
            ]
        })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({ success: true, message: "Messages are fetched successfully", data: messages });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch messages", error });
    }
};

// Mark all unseen messages as seen for a specific chat
const markMessagesAsSeen = async (req, res) => {
    try {
        const { chatUserId } = req.params;
        const userId = req.user._id;

        // Update all unseen messages where logged-in user is the receiver
        const updatedMessages = await Message.updateMany(
            { sender_id: chatUserId, receiver_id: userId, is_seen: false },
            { $set: { is_seen: true } }
        );

        res.status(200).json({
            success: true,
            message: "Messages marked as seen",
            modifiedCount: updatedMessages.modifiedCount
        });

    } catch (error) {
        console.error("Error in markMessagesAsSeen:", error);
        res.status(500).json({ success: false, message: "Failed to mark messages as seen", error });
    }
};

module.exports = { addMessage, getMessages, markMessagesAsSeen };