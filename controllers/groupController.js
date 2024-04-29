import { GroupMessage } from "../models/groupMessageModel.js";
import { Group } from "../models/groupModel.js";
import { getSocketIdByGroupId, io } from "../Socket.js"

// BELOW FUNCTIONS USED FOR BOTH CREATING NEW GRP AND SENDING MESSAGE TO GROUP
export const createGroup = async (req, res) => {

    try {

        console.log(req.body);
        const { groupName, groupCreatedBy, groupMembers } = req.body;
        let newGroup = new Group({ ...req.body, groupMembers: JSON.parse(groupMembers) })
        let doc = await newGroup.save();

        return res.status(200).json({ message: 'NEW GROUP CREATED', data: doc })


    } catch (error) {
        console.log(error);
        res.status(400).json({ message: 'ERROR IN MAKING NEW GROUP', Error: error, data: null })

    }


}

export const sendGroupMessage = async (req, res) => {

    try {

        const { senderId, groupId, message } = req.body;

        let findGroup = await Group.findById(groupId)

        if (!findGroup) {
            return res.status(400).json({ message: 'GROUP NOT FOUND', data: null })
        }

        let newGroupMessage = new GroupMessage(req.body);
        let doc = await newGroupMessage.save();

        findGroup.groupMessages.push(doc._id)


        // SOCKET IO
        io.to(groupId).emit("group-message", doc);
        console.log("SENDING MESSAGE TO GROUP SOCKET ID : " + groupId);
        console.log(groupId);

        await findGroup.save();

        return res.status(200).json({ message: 'GROUP MESSAGE ADDED', data: doc })


    } catch (error) {
        console.log(error);
        res.status(400).json({ message: 'ERROR IN SENDING GROUP MESSAGE', Error: error, data: null })

    }


}

export const getGroupMessages = async (req, res) => {

    try {

        console.log(req.body);
        const { groupId } = req.body;

        let doc = await Group.findById(groupId).populate("groupMessages");
        return res.status(200).json({ message: 'GET GROUP MESSAGE', data: doc })

    } catch (error) {
        console.log(error);
        res.status(400).json({ message: 'ERROR IN GETTING GROUP MESSAGE', Error: error, data: null })

    }


}

export const addMemberToGroup = async (req, res) => {

    try {

        console.log(req.body);
        const { groupId, userId } = req.body;

        let group = await Group.findByIdAndUpdate({ _id: groupId }, { $push: { groupMembers: userId } }, { new: true })

        return res.status(200).json({ message: 'GET GROUP MESSAGE', data: group })

    } catch (error) {
        console.log(error);
        res.status(400).json({ message: 'ERROR IN GETTING GROUP MESSAGE', Error: error, data: null })

    }

}

// GETTING GROUPS IN WHICH A USER IS EITHER A OWNER OR MEMBER
export const getUserGroups = async (req, res) => {

    try {

        const { userId } = req.query;

        let doc = await Group.find({ $or: [{ groupCreatedBy: userId }, { groupMembers: { $in: [userId] } }] }).populate("groupMessages");
        return res.status(200).json({ message: 'GET USER GROUPS', data: doc })

    } catch (error) {
        console.log(error);
        res.status(400).json({ message: 'ERROR IN GETTING USER GROUPS', Error: error, data: null })

    }


}