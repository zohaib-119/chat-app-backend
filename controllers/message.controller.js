const Message = require("../models/message.model");

// Add a new message
const addMessage = async (req, res) => {
    try {
        const { receiver_id, text } = req.body;
        const sender_id = req.user._id; // Assuming user is authenticated

        const message = new Message({ sender_id, receiver_id, text });
        await message.save();

        // TODO: Implement socket event to notify receiver

        res.status(201).json({ success: true, message: "Message is sent successfully", data: message });
    } catch (error) {
        console.log("Error in add message controller: ", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Delete a message
const deleteMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const message = await Message.findById(messageId);

        if (!message) {
            return res.status(404).json({ success: false, message: "Message not found" });
        }

        if (message.sender_id.toString() !== req.user._id) {
            return res.status(403).json({ success: false, message: "Unauthorized action" });
        }

        await Message.findByIdAndDelete(messageId);
        res.status(200).json({ success: true, message: "Message deleted successfully" });

        // TODO: Implement socket event to notify receiver about message deletion

    } catch (error) {
        console.log("Error in delete message controller: ", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Edit a message
const editMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const { text } = req.body;
        const message = await Message.findById(messageId);

        if (!message) {
            return res.status(404).json({ success: false, message: "Message not found" });
        }

        if (message.sender_id.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: "Unauthorized action" });
        }

        message.text = text;
        await message.save();
        res.status(200).json({ success: true, message: "Message is updated successfully", data: message});

        // TODO: Implement socket event to update message in real-time

    } catch (error) {
        console.log("Error in edit message controller: ", error.message);
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
                { sender_id: req.user.id, receiver_id: chatUserId },
                { sender_id: chatUserId, receiver_id: req.user.id }
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

module.exports = { addMessage, deleteMessage, editMessage, getMessages };