import { PostService } from '../services/post.service.js';
import createError from 'http-errors';
import { CommentService } from '../services/comment.service.js';

export class PostController {

    constructor() {
        this.postService = new PostService();
        this.commentService = new CommentService();

        this.getAll = this.getAll.bind(this);
        this.getComments = this.getComments.bind(this);
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    async getAll(request, response) {
        const posts = await this.postService.getAll();
        return response.send(posts);
    }

    getComments(request, response, next) {
        const postId = request.params['postId'];

        if (isNaN(postId)) {
            throw createError(400, 'postId must be a number');
        }

        return this.commentService.getCommentsByPost(Number(postId))
            .then(comments => response.send(comments))
            .catch(next);
    }

    create(request, response, next) {
        return this.postService.create(request.body)
            .then(post => response.send(post))
            .catch(next);
    }

    update(request, response, next) {
        const postId = request.params['postId'];

        if (isNaN(postId)) {
            throw createError(400, 'postId must be a number');
        }

        const postUpdateData = {
            id: Number(postId),
            ...request.body,
        }

        return this.postService.update(postUpdateData)
            .then(() => response.send(postUpdateData))
            .catch(next);
    }

    delete(request, response, next) {
        const postId = request.params['postId'];

        if (isNaN(postId)) {
            throw createError(400, 'postId must be a number');
        }

        return this.postService.delete(Number(postId))
            .then(() => response.send(postId))
            .catch(next);
    }
}