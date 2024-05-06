import express from "express"
import { createMessage, deleteMessage, getConversations, unseenMessage, updateMessage } from "../controllers/messageController.js";

const router = express.Router()

router.post('/send', createMessage)
    .post("/getMessages", getConversations)
    .post("/unseenMessages", unseenMessage)
    .post("/updateMessage", updateMessage)
    .post("/deleteMessage", deleteMessage)


export default router;