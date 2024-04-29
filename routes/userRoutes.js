import express from "express"
import { getAllUsers, loginUser, registerUser, searchUsers } from "../controllers/userController.js"

const router = express.Router()

router.post('/register', registerUser)
    .post("/login", loginUser)
    .get("/all", getAllUsers)
    .get("/search", searchUsers)


export default router;