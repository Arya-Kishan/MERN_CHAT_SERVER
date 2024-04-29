import mongoose from "mongoose";

const groupMessageModel = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    groupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group",
        required: true
    },
    message: {
        type: String,
        required: true
    }
}, { timestamps: true });

export const GroupMessage = mongoose.model("GroupMessage", groupMessageModel);