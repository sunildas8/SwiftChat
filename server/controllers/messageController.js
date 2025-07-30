import cloudinary from '../lib/cloudinary.js';
import Message from '../models/Message.js';
import User from '../models/User.js';
import { io, userSocketMap } from '../server.js';

// Get all users except the logged in user

export const getUsersForSidebar = async (req, res)=>{
    try {
        const userId = req.user._id;
        const filteredUsers = await User.find({_id: {$ne: userId}}).select("-password");

        // Count number messages to not seen

        const unseenMessages = {};
        const promises = filteredUsers.map(async (user)=>{
            const messages = await Message.find({senderId: user._id, receverId: userId, seen: false});
            if (messages.length > 0) {
                unseenMessages[user._id] = messages.length;
            }
        })
        await Promise.all(promises);
        res.json({success: true, users: filteredUsers, unseenMessages});
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}

// Get all messages for selected user

export const getMessages = async (req, res)=>{
    try {
        const {id: selectedUserId} = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                {senderId: myId, receverId: selectedUserId},
                {senderId: selectedUserId, receverId: myId}
            ]
        })
        await Message.updateMany({senderId: selectedUserId, receverId: myId}, {seen: true});
        res.json({success: true, messages})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}

// Api to mark message as seen using message id

export const markMessagAsSeen = async (req, res)=>{
    try {
        const {id} = req.params;
        await Message.findByIdAndUpdate(id, {seen: true});

        res.json({success: true})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}

// Send messages to the selected user

export const sendMessage = async (req, res)=>{
    try {
        const {text, image} = req.body;
        const receverId = req.params.id;
        const senderId = req.user._id;

        let imageUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image)
            imageUrl = uploadResponse.secure_url;
        }
        
        const newMessage = await Message.create({
            senderId,
            receverId,
            text,
            image : imageUrl
        })

        // Emait the new message to the recever's socket
        const receverSocketId = userSocketMap[receverId];
        
        if (receverSocketId) {
            io.to(receverSocketId).emit("newMessage", newMessage);
        }

        res.json({success: true, newMessage})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}