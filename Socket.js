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

export const getSocketIdByUserId = (userId) =>{
    return userSocketMap[userId];
}

io.on("connection", (socket) => {

    console.log("USER CONNECTED : ", socket.id)
    const userId = socket.handshake.query.userId
    console.log(userId);
    if (userId !== undefined) {
        userSocketMap[userId] = socket.id;
    }

    console.log(userSocketMap);

    socket.on("disconnect", () => {
        console.log("USER DISCONNECTED : ", socket.id);
    })


});


export { app, io, server }