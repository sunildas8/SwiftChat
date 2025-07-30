import express from 'express'
import { protectRouter } from '../middleware/auth.js';
import { getMessages, getUsersForSidebar, markMessagAsSeen, sendMessage } from '../controllers/messageController.js';

const messageRouter = express.Router();

messageRouter.get('/users', protectRouter, getUsersForSidebar);
messageRouter.get('/:id', protectRouter, getMessages);
messageRouter.put('/mark/:id', protectRouter, markMessagAsSeen);
messageRouter.post('/send/:id', protectRouter, sendMessage);

export default messageRouter;