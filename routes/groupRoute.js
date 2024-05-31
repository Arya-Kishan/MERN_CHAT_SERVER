import express from "express"
import { addMemberToGroup, createGroup, deleteGroup, getGroupMessages, getUserGroups, sendGroupMessage, updateGroup } from "../controllers/groupController.js";

const router = express.Router()

router.post("/create", createGroup)
    .post("/send", sendGroupMessage)
    .post("/getGroupMessages", getGroupMessages)
    .post("/addMember", addMemberToGroup)
    .get("/getUserGroups", getUserGroups)
    .post("/updateGroup", updateGroup)
    .delete("/deleteGroup", deleteGroup)


export default router;