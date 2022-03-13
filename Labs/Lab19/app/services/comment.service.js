import createError from 'http-errors';
import { UserService } from './user.service.js';
import { PostService } from './post.service.js';
import { Comment } from '../database/db.js';

export class CommentService {

    constructor() {
        this.userService = new UserService();
        this.postService = new PostService();

        this.create = this.create.bind(this);
        this.getCommentsByPost = this.getCommentsByPost.bind(this);
        this.getComment = this.getComment.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    getComment(commentId) {
        return Comment.findByPk(commentId);
    }

    async create(commentCreateData) {
        const user = await this.userService.getUser(commentCreateData.owner_id);
        const post = await this.postService.getPost(commentCreateData.post_id);

        if (!user) {
            throw createError(400, `Can not create comment, because ` +
                `user with id=${commentCreateData.owner_id} has not been found`);
        }

        if (!post) {
            throw createError(400, `Can not create comment, because ` +
                `post with id=${commentCreateData.post_id} has not been found`);
        }

        return Comment.create(commentCreateData);
    }

    async getCommentsByPost(postId) {
        const post = await this.postService.getPost(postId);

        if (!post) {
            throw createError(400, `Can not find comments, because ` +
                `post with id=${postId} has not been found`);
        }

        return Comment.findAll({ where: { post_id: postId } });
    }

    async update(commentUpdateData) {
        const comment = await this.getComment(commentUpdateData.id);
        const user = await this.userService.getUser(commentUpdateData.owner_id);
        const post = await this.postService.getPost(commentUpdateData.post_id);

        if (!comment) {
            throw createError(400, `Can not update comment with id=${commentUpdateData.id}, ` +
                `because it has not been found`);
        }

        if (!user) {
            throw createError(400, `Can not update comment, because ` +
                `user with id=${commentUpdateData.owner_id} has not been found`);
        }

        if (!post) {
            throw createError(400, `Can not update comment, because ` +
                `post with id=${commentUpdateData.post_id} has not been found`);
        }

        return Comment.update(commentUpdateData, { where: { id: commentUpdateData.id } });
    }

    async delete(commentId) {
        const comment = await this.getComment(commentId);

        if (!comment) {
            throw createError(400, `Can not delete comment with id=${commentId}, ` +
                `because it has not been found`);
        }

        return Comment.destroy({ where: { id: commentId } });
    }
}