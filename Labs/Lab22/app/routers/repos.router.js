import express from 'express';
import { ReposController } from '../controllers/repos.controller.js';

const reposRouter = express.Router();
const reposController = new ReposController();

reposRouter.get('/', reposController.getAll);
reposRouter.get('/:id', reposController.getOne);
reposRouter.post('/', reposController.create);
reposRouter.put('/:id', reposController.update);
reposRouter.delete('/:id', reposController.remove);

export { reposRouter };