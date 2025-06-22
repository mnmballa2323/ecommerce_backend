const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema(
    {
        members: {
            type: Array,
        },
        blockedUsers: {
            type: Array,
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

const ChatModel = mongoose.model("Chat", ChatSchema);
module.exports = ChatModel;