import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import connectDB from "./config/database.js";
import userRouter from "./routes/userRoutes.js"
import messageRouter from "./routes/messageRoutes.js"
import { app, server } from "./Socket.js"

dotenv.config({});

connectDB();

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
}))


app.use("/api/v1/user", userRouter)
app.use("/api/v1/message", messageRouter)

app.get("/", (req, res) => {
    res.send("arya")
})

server.listen(process.env.PORT, () => {
    console.log("SERVER LISTENED AT " + process.env.PORT);
})