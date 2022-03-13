import { Post } from '../database/db.js';
import { UserService } from './user.service.js';
import createError from 'http-errors';

export class PostService {

    constructor() {
        this.userService = new UserService();

        this.getAll = this.getAll.bind(this);
        this.getPost = this.getPost.bind(this);
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    getAll() {
        return Post.findAll();
    }

    getPost(postId) {
        return Post.findByPk(postId);
    }

    async create(postCreateData) {
        const user = await this.userService.getUser(postCreateData.owner_id);

        if (!user) {
            throw createError(400, `Can not create post, because ` +
                `user with id=${postCreateData.owner_id} has not been found`);
        }

        return Post.create(postCreateData);
    }

    async update(postUpdateData) {
        const user = await this.userService.getUser(postUpdateData.owner_id);
        const post = await this.getPost(postUpdateData.id);

        if (!user) {
            throw createError(400, `Can not update post, because ` +
                `user with id=${postUpdateData.owner_id} has not been found`);
        }

        if (!post) {
            throw createError(400, `Can not update post with id=${postUpdateData.id}, ` +
                `because it has not been found`);
        }

        return Post.update(postUpdateData, { where: { id: postUpdateData.id } });
    }

    async delete(postId) {
        const post = await this.getPost(postId);

        if (!post) {
            throw createError(400, `Can not delete post with id=${postId}, ` +
                `because it has not been found`);
        }

        return Post.destroy({ where: { id: postId } });
    }
}