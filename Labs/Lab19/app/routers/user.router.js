import express from 'express';
import { UserController } from '../controllers/user.controller.js';

const userRouter = express.Router();

const userController = new UserController();

userRouter.post('/', userController.create);

userRouter.put('/:userId', userController.update);

userRouter.delete('/:userId', userController.delete);

userRouter.get('/', userController.getAll);

export { userRouter };