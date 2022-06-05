import { User } from '../22-02.persistence.js';
import { parseUserToDto } from '../helpers/user.helper.js';
import createError from 'http-errors';
import { ReadPermission } from '../helpers/casl.helper.js';

export class UsersController {

  constructor() {
  }

  ability(request, response) {
    return response.send(request.ability.rules);
  }

  async getAll(request, response, next) {
    const canActivate = request.ability.can(ReadPermission, 'All');
    if (!canActivate) {
      return next(createError(403, `Access denied!`));
    }

    const users = await User.findAll();
    const userDtos = users.map(user => parseUserToDto(user));
    return response.send(userDtos);
  }

  async getOne(request, response, next) {
    const userId = Number(request.params.id);
    const user = await User.findByPk(userId);

    const canActivate = request.ability.can(ReadPermission, user);
    if (!canActivate) {
      return next(createError(403, `Access denied!`));
    }

    if (!user) {
      return next(createError(400, `User with id=${ userId } does not exist`));
    }

    return response.send(parseUserToDto(user));
  }
}