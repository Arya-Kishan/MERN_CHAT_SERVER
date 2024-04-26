import express from "express"
import { getAllUsers, loginUser, registerUser } from "../controllers/userController.js"

const router = express.Router()

router.post('/register', registerUser)
    .post("/login", loginUser)
    .get("/all", getAllUsers)


export default router;