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
}, { timestamps: true })

export const User = mongoose.model("User", userModel)
