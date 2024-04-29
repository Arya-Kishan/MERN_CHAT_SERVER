import mongoose from "mongoose";

const groupModel = new mongoose.Schema({
    groupName: {
        type: String,
        default: "",
        unique:true,
        require:true
    },
    groupCreatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require:true
    },
    groupMembers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
    }],
    groupMessages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "GroupMessage",
        default: [],
    }]
}, { timestamps: true });

export const Group = mongoose.model("Group", groupModel);