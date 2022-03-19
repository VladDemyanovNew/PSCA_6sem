import express from 'express';
import { UserController } from '../controllers/user.controller.js';

const userRouter = express.Router();
const userController = new UserController();

userRouter.get('/', userController.indexView);

userRouter.get('/add', userController.addView);

userRouter.get('/update/:userId', userController.updateView);

userRouter.post('/add', userController.add);

userRouter.post('/update', userController.update);

userRouter.post('/delete', userController.delete);

export { userRouter };
