import express from 'express';
import { CommentController } from '../controllers/comment.controller.js';

const commentRouter = express.Router();

const commentController = new CommentController();

commentRouter.post('/', commentController.create);

commentRouter.put('/:commentId', commentController.update);

commentRouter.delete('/:commentId', commentController.delete);

export { commentRouter };