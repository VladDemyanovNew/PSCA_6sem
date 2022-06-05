import express from 'express';
import { UsersController } from '../controllers/users.controller.js';

const usersRouter = express.Router();
const usersController = new UsersController();

usersRouter.get('/ability', usersController.ability);
usersRouter.get('/', usersController.getAll);
usersRouter.get('/:id', usersController.getOne);

export { usersRouter };