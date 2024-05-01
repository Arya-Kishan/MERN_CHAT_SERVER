import mongoose from "mongoose";

const unseenMessageModel = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    groupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group",
    },
    message: {
        type: String,
        required: true
    }
}, { timestamps: true });

export const UnseenMessage = mongoose.model("UnseenMessage", unseenMessageModel);