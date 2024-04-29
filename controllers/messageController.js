import { Conversation } from "../models/conversationModel.js";
import { GroupMessage } from "../models/groupMessageModel.js";
import { Group } from "../models/groupModel.js";
import { Message } from "../models/messageModel.js";
import { getSocketIdByUserId, io } from "../Socket.js"

export const createMessage = async (req, res) => {

    try {
        let { senderId, receiverId, senderMessage } = req.body;

        let getConversation = await Conversation.findOne({ participants: { $all: [senderId, receiverId] } })

        if (!getConversation) {
            getConversation = await Conversation.create({ participants: [senderId, receiverId] })
        }

        let newMessage = await Message.create({ senderId, receiverId, message: senderMessage })

        if (newMessage) {
            getConversation.messages.push(newMessage._id)
        }

        await Promise.all[getConversation.save(), newMessage.save()]

        // SOCKET IO
        const receiverSocketId = getSocketIdByUserId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }


        return res.status(200).json({ message: "NEW CONVERSATION OR MESSAGE ADDED CREATED", data: newMessage })

    } catch (error) {
        console.log(error);
        res.status(400).json({ message: 'ERROR IN CREATING NEW CONVERSATION OR MESSAGE', data: null })
    }


}

export const getConversations = async (req, res) => {

    try {

        let { senderId, receiverId } = req.body;

        let getConversation = await Conversation.findOne({ participants: { $all: [senderId, receiverId] } }).populate("messages")

        res.status(200).json({ message: "GETTING CONVERSATION", data: getConversation })

    } catch (error) {
        console.log(error);
        res.status(400).json({ message: 'ERROR IN CREATING NEW CONVERSATION OR MESSAGE', data: null })

    }


}
