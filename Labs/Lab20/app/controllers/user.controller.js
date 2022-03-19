import { UserService } from '../services/user.service.js';
import createError from 'http-errors';

export class UserController {

    constructor() {
        this.userService = new UserService();

        this.indexView = this.indexView.bind(this);
        this.addView = this.addView.bind(this);
        this.updateView = this.updateView.bind(this);
        this.add = this.add.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    indexView(request, response) {
        return response.render('index.hbs', {
            users: this.userService.getAll(),
        });
    }

    addView(request, response) {
        return response.render('add.hbs', {
            users: this.userService.getAll(),
        });
    }

    updateView(request, response, next) {
        const userId = request.params['userId'];

        if (isNaN(userId)) {
            throw createError(400, 'userId должен быть числом!');
        }

        return response.render('update.hbs', {
            users: this.userService.getAll(),
            user: this.userService.getUser(Number(userId)),
        });
    }

    add(request, response) {
        this.userService.create(request.body);
        return response.redirect("/users/");
    }

    update(request, response) {
        if (isNaN(request.body.id)) {
            throw createError(400, 'userId должен быть числом!');
        }

        const userUpdateData = {
            ...request.body,
            id: Number(request.body.id),
        };

        this.userService.update(userUpdateData);
        return response.redirect("/users/");
    }

    delete(request, response, next) {
        const userId = request.body.userId;

        if (isNaN(userId)) {
            throw createError(400, 'userId должен быть числом!');
        }

        this.userService.delete(Number(userId));
        return response.redirect("/users/");
    }
}
