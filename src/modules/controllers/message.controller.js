const ChatModel = require("../model/chatModel");
const MessageModel = require("../model/messageModel");
const bcrypt = require("bcrypt");

module.exports.addMessage = async (req, res) => {
    const { chatId, senderId, text, images } = req.body;

    try {
        const chat = await ChatModel.findById(chatId);

        if (chat && chat.members.some(member => chat.blockedUsers.includes(member))) {
            return res.status(400).json({ success: false, message: 'At least one user in the chat is blocked. Cannot add message.' });
        }

        // Your code to add the message
        const message = new MessageModel({
            chatId,
            senderId,
            text,
            images,
        });

        const result = await message.save();
        res.status(200).json(result);
    } catch (error) {
        console.error('Error adding message:', error);
        res.status(500).json({ success: false, message: 'Error adding message.' });
    }
};


module.exports.getMessages = async (req, res) => {
    const { chatId } = req.params;
    try {
        const result = await MessageModel.find({ chatId });
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json(error);
    }
};





module.exports.deleteMessage = async (req, res) => {
    try {
        const id = req.params.id;
        const deleteUniqueMessage = await MessageModel.findByIdAndDelete(id);
        const deletedChat = await MessageModel.deleteMany({ chatId: id });

        if (!deletedChat || !deleteUniqueMessage) {
            return res.status(404).json({ message: 'Message not found' });
        }

        res.status(200).json({ message: 'Message deleted successfully' });
    } catch (error) {
        res.status(500).json(error);
    }
};

// Update message:-
module.exports.EditMessage = async (req, res) => {
    try {
        const messageId = req.params.id;
        const newText = req.body.text;

        const updatedMessage = await MessageModel.findByIdAndUpdate(messageId, { text: newText }, { new: true });

        res.json(updatedMessage);
    } catch (error) {
        console.error('Error updating message:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};