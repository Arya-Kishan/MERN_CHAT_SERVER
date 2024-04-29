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

    console.log("USER CONNECTED : ", socket.id)
    const userId = socket.handshake.query.userId
    console.log(userId);
    if (userId !== undefined) {
        userSocketMap[userId] = socket.id;
    }

    io.emit("onlineUsers", Object.keys(userSocketMap))


    socket.on("group-selection", ({ groupId, groupName }) => {
        console.log("ROOM CREATED WITH ID : " + groupId);
        socket.join(groupId)
        groupSocketMap[groupName] = groupId;
    })

    socket.on("disconnect", () => {
        console.log("USER DISCONNECTED : ", socket.id);
        delete userSocketMap[userId];
        io.emit("onlineUsers", Object.keys(userSocketMap))
    })


});


export { app, io, server }