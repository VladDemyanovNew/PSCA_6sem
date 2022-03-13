import { CommentService } from '../services/comment.service.js';
import createError from "http-errors";

export class CommentController {

    constructor() {
        this.commentService = new CommentService();

        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    create(request, response, next) {
        return this.commentService.create(request.body)
            .then(comment => response.send(comment))
            .catch(next);
    }

    update(request, response, next) {
        const commentId = request.params['commentId'];

        if (isNaN(commentId)) {
            throw createError(400, 'commentId must be a number');
        }

        const commentUpdateData = {
            id: Number(commentId),
            ...request.body,
        }

        return this.commentService.update(commentUpdateData)
            .then(() => response.send(commentUpdateData))
            .catch(next);
    }

    delete(request, response, next) {
        const commentId = request.params['commentId'];

        if (isNaN(commentId)) {
            throw createError(400, 'commentId must be a number');
        }

        return this.commentService.delete(Number(commentId))
            .then(() => response.send(commentId))
            .catch(next);
    }
}