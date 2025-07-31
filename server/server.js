import express from 'express'
import 'dotenv/config'
import http from 'http'
import cors from 'cors'
import { connectDB } from './lib/db.js';
import userRouter from './Routes/userRoutes.js';
import messageRouter from './Routes/messageRoutes.js';
import { Server } from 'socket.io';

// Create a Express app from HTTP server

const app = express();
const server = http.createServer(app)

// Initialize socket.io server
export const io = new Server(server, {
    cors: {origin: "*"}
})

// Store user online
export const userSocketMap = {}; // {userid: socketid}

// socket.io connection handler
io.on("connection", (socket)=>{
    const userId = socket.handshake.query.userId;
    console.log("User connected", userId);
    
    if(userId) userSocketMap[userId] = socket.id;

    // Emit online users to all connect clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnected", ()=>{
        console.log("User disconnected", userId);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap))
    })
})

// Middleware setup
app.use(express.json({limit: "4mb"}));
app.use(cors());

// Connect to MongoDB
await connectDB();

// Routes setup
app.use("/api/status", (req, res)=> res.send("Server is live"));
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

if (process.env.NODE_ENV !== "production") {
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, ()=> console.log("Server is running on PORT " + PORT));
}

// Export server for vercel
export default server;