import createError from 'http-errors';
import { User } from '../database/db.js';

export class UserService {

    constructor() {
        this.getAll = this.getAll.bind(this);
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.getUser = this.getUser.bind(this);
    }

    getAll() {
        return User.findAll();
    }

    getUser(userId) {
        return User.findByPk(userId);
    }

    create(userCreateData) {
        return User.create(userCreateData);
    }

    async update(userUpdateData) {
        const doesUserExist = (await User.findByPk(userUpdateData.id)) !== null;

        if (doesUserExist) {
            return User.update(userUpdateData, { where: { id: userUpdateData.id } });
        } else {
            throw createError(400, `Can not update user with id=${userUpdateData.id}, ` +
                `because it has not been found`);
        }
    }

    async delete(userId) {
        const doesUserExist = (await User.findByPk(userId)) !== null;

        if (doesUserExist) {
            // TODO: Delete SUBSCRIPTIONS, COMMENTS, LIKES, POSTS
            return User.destroy({ where: { id: userId } });
        } else {
            throw createError(400, `Can not delete user with id=${userId}. ` +
                `because it has not been found`);
        }
    }
}