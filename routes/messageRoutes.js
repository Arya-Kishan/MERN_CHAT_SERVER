import express from "express"
import { createMessage, getConversations } from "../controllers/messageController.js";

const router = express.Router()

router.post('/send', createMessage)
    .post("/getMessages", getConversations)


export default router;