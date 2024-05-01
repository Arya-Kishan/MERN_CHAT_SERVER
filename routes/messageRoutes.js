import express from "express"
import { createMessage, getConversations, unseenMessage } from "../controllers/messageController.js";

const router = express.Router()

router.post('/send', createMessage)
    .post("/getMessages", getConversations)
    .post("/unseenMessages", unseenMessage)


export default router;