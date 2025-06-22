const ChatModel = require("../model/chatModel");

module.exports.createChat = async (req, res) => {
    const newChat = new ChatModel({
        members: [req.body.senderEmail, req.body.receiverEmail],
    });
    try {
        const result = await newChat.save();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

module.exports.userChats = async (req, res) => {
    try {
        const chat = await ChatModel.find({
            members: { $in: [req.params.userEmail] },
        });
        res.status(200).json(chat);
    } catch (error) {
        res.status(500).json(error);
    }
};

module.exports.findChat = async (req, res) => {
    try {
        const chat = await ChatModel.findOne({
            members: { $all: [req.params.firstEmail, req.params.secondEmail] },
        });
        res.status(200).json(chat)
    } catch (error) {
        res.status(500).json(error)
    }
};

module.exports.deleteChat = async (req, res) => {
    try {
        const id = req.params.id;
        console.log(id);
        const deleteUniqueChat = await ChatModel.findByIdAndDelete(id);

        if (!deleteUniqueChat) {
            return res.status(404).json({ message: 'Chat not found' });
        }

        res.status(200).json({ message: 'Chat deleted successfully' });
    } catch (error) {
        res.status(500).json(error);
    }
};

// Block user
module.exports.blockUser = async (req, res) => {
    try {
        const { chatId, email } = req.params;

        const chat = await ChatModel.findById(chatId);

        if (!chat) {
            console.log("Chat not found");
            return res.status(404).json({ message: 'Chat not found' });
        }

        // Check if the user is already blocked
        if (!chat.blockedUsers.includes(email)) {
            chat.blockedUsers.push(email);
            await chat.save();

            return res.status(200).json({ message: `User blocked Successfully` });
        } else {
            return res.status(400).json({ message: `User is already blocked` });
        }
    } catch (error) {
        console.error("Error blocking user:", error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Unblock user
module.exports.unblockUser = async (req, res) => {
    try {
    const { chatId, email } = req.params;

    const chat = await ChatModel.findById(chatId);

    if (!chat) {
      console.log("Chat not found");
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Check if the user is blocked
    const blockedIndex = chat.blockedUsers.indexOf(email);
    if (blockedIndex !== -1) {
      chat.blockedUsers.splice(blockedIndex, 1);
        await chat.save();
        
        return res.status(200).json({ message: `User unblocked` });
    } else {
        return res.status(400).json({ message: `User is not blocked` });
    }
  } catch (error) {
    console.error("Error unblocking user:", error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
