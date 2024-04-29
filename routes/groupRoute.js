import express from "express"
import { addMemberToGroup, createGroup, getGroupMessages, getUserGroups, sendGroupMessage } from "../controllers/groupController.js";

const router = express.Router()

router.post("/create", createGroup)
    .post("/send", sendGroupMessage)
    .post("/getGroupMessages", getGroupMessages)
    .post("/addMember", addMemberToGroup)
    .get("/getUserGroups", getUserGroups)


export default router;