import express from 'express';
import { CommitsController } from '../controllers/commits.controller.js';

const commitsRouter = express.Router();
const commitsController = new CommitsController();

commitsRouter.get('/:id/commits', commitsController.getAll);
commitsRouter.get('/:id/commits/:commitId', commitsController.getOne);
commitsRouter.post('/:id/commits', commitsController.create);
commitsRouter.put('/:id/commits/:commitId', commitsController.update);
commitsRouter.delete('/:id/commits/:commitId', commitsController.remove);

export { commitsRouter };