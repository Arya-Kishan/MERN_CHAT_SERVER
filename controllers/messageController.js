import { Conversation } from "../models/conversationModel.js";
import { GroupMessage } from "../models/groupMessageModel.js";
import { Group } from "../models/groupModel.js";
import { Message } from "../models/messageModel.js";
import { UnseenMessage } from "../models/unseenMessageModel.js";
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

export const unseenMessage = async (req, res) => {

    try {

        console.log(req.body);
        console.log(req.query);

        if (req.query.type == 'add') {

            let doc = await UnseenMessage.create(req.body)
            doc = await doc.save();

            return res.status(200).json({ message: "NEW UNSEEN MESSAGE ADDED", data: doc })

        } else if (req.query.type == 'get') {

            let doc = await UnseenMessage.find({ receiverId: req.body.receiverId })

            return res.status(200).json({ message: "GETTING UNSEEN MESSAGE ", data: doc })

        } else if (req.query.type == "delete") {

            console.log(req.body);

            req.body.forEach(async (e) => {
                await UnseenMessage.findByIdAndDelete(e._id)
            })

            return res.status(200).json({ message: "DELETED UNSEEN MESSAGE FROM BACKEND", data: "apple" })

        }


    } catch (error) {
        console.log(error);
        res.status(400).json({ message: 'ERROR IN ADDING UNSEEN MESSAGE', data: null })
    }


}

export const updateMessage = async (req, res) => {

    let { messageId, type, newMessage } = req.body;
    console.log(req.body);

    let updatedMessage;

    if (type == "solo") {

        updatedMessage = await Message.findByIdAndUpdate(messageId, { message: newMessage }, { new: true })

    } else {

        updatedMessage = await GroupMessage.findByIdAndUpdate(messageId, { message: newMessage }, { new: true })
    }

    console.log(updatedMessage);

    res.status(200).json({ message: "UPDATED MESSAGE", data: updatedMessage })

}

export const deleteMessage = async (req, res) => {

    let { messageId, type } = req.body;
    console.log(req.body);

    let updatedMessage;

    if (type == "solo") {

        updatedMessage = await Message.findByIdAndUpdate(messageId, { message: "Deleted..." }, { new: true })

    } else {

        updatedMessage = await GroupMessage.findByIdAndUpdate(messageId, { message: "Deleted..." }, { new: true })
    }

    console.log(updatedMessage);

    res.status(200).json({ message: "UPDATED MESSAGE", data: updatedMessage })

}