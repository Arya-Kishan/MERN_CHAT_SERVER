import { Server } from "socket.io"
import express from "express"
import http from "http"

const app = express();
const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["POST", "GET"]
    }
});

let userSocketMap = {};
let groupSocketMap = {};

export const getSocketIdByUserId = (userId) => {
    return userSocketMap[userId];
}

export const getSocketIdByGroupId = (groupName) => {
    return groupSocketMap[groupName];
}

io.on("connection", (socket) => {

    const userId = socket.handshake.query.userId
    if (userId !== undefined) {
        userSocketMap[userId] = socket.id;
    }

    io.emit("onlineUsers", Object.keys(userSocketMap))


    socket.on("group-selection", ({ groupId, groupName }) => {
        socket.join(groupId)
        groupSocketMap[groupName] = groupId;
    })

    socket.on("leave-group", ({ userId, groupId }) => {

        socket.leave(groupId);
        console.log("MAKING USER LEAVE GROUP");
        
    })

    // USED FOR SHOWING TYPING LOADER
    socket.on("User-Typing", ({ type, userId }) => {
        let userSocketId = getSocketIdByUserId(userId)
        if (type == "start") {
            io.to(userSocketId).emit("is-typing", { typing: true, userId })
        } else {
            io.to(userSocketId).emit("is-typing", { typing: false, userId })
        }
    })

    socket.on("disconnect", () => {
        delete userSocketMap[userId];
        io.emit("onlineUsers", Object.keys(userSocketMap))
    })


});


export { app, io, server }