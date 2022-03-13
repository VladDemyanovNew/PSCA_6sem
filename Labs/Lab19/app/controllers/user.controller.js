import { UserService } from '../services/user.service.js';
import createError from 'http-errors';

export class UserController {

    constructor() {
        this.userService = new UserService();

        this.getAll = this.getAll.bind(this);
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    async getAll(request, response) {
        const users = await this.userService.getAll();
        return response.send(users);
    }

    create(request, response, next) {
        return this.userService.create(request.body)
            .then(user => response.send(user))
            .catch(next);
    }

    update(request, response, next) {
        const userId = request.params['userId'];

        if (isNaN(userId)) {
            throw createError(400, 'userId must be a number');
        }

        const userUpdateData = {
            id: Number(userId),
            ...request.body,
        };

        return this.userService.update(userUpdateData)
            .then(() => response.send(userUpdateData))
            .catch(next);
    }

    async delete(request, response, next) {
        const userId = request.params['userId'];

        if (isNaN(userId)) {
            throw createError(400, 'userId must be a number');
        }

        return this.userService.delete(Number(userId))
            .then(() => response.send(userId))
            .catch(next);
    }

}