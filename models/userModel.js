import mongoose from "mongoose"

const userModel = new mongoose.Schema({
    userName: {
        type: String,
        default: "",
    },
    password: {
        type: String,
        default: "",
    },
    profilePic: {
        type: String,
        default: "",
    },
    gender: {
        type: String,
        enum: ["male", "female"],
        default: "",
    },
    friends:  [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default:[],
    }],
    active:{
        type:Date,
        default:Date.now()
    }
}, { timestamps: true })

export const User = mongoose.model("User", userModel)
