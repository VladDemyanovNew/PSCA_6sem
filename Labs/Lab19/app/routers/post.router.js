import express from 'express';
import { PostController } from '../controllers/post.controller.js';

const postRouter = express.Router();

const postController = new PostController();

postRouter.post('/', postController.create);

postRouter.put('/:postId', postController.update);

postRouter.delete('/:postId', postController.delete);

postRouter.get('/', postController.getAll);

postRouter.get('/:postId/comments', postController.getComments);

export { postRouter };