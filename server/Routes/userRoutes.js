import express from 'express';
import { checkAuth, login, signup, updateProfile } from '../controllers/userController.js';
import { protectRouter } from '../middleware/auth.js';

const userRouter = express.Router()

userRouter.post('/signup', signup);
userRouter.post('/login', login);
userRouter.put('/update-profile', protectRouter, updateProfile);
userRouter.get('/check', protectRouter, checkAuth);

export default userRouter;