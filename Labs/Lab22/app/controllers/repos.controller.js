import { Repos, User } from '../22-02.persistence.js';
import createError from 'http-errors';
import { CreatePermission, DeletePermission, ReadPermission, UpdatePermission } from '../helpers/casl.helper.js';

export class ReposController {

  constructor() {
  }

  async getAll(request, response) {
    const repositories = await Repos.findAll();
    return response.send(repositories);
  }

  async getOne(request, response, next) {
    const repositoryId = Number(request.params.id);
    const repository = await Repos.findByPk(repositoryId);
    if (!repository) {
      return next(createError(400, `Repository with id=${ repositoryId } does not exist`));
    }

    return response.send(repository);
  }

  async create(request, response, next) {
    const canActivate = request.ability.can(CreatePermission, 'Repos');
    if (!canActivate) {
      return next(createError(403, `Access denied!`));
    }

    const name = request.body.name;
    const authorId = Number(request.currentUser.id);

    const doesAuthorExist = !!(await User.findByPk(authorId));
    if (!doesAuthorExist) {
      return next(createError(400, `User with id=${ authorId } does not exist`));
    }

    const repository = await Repos.create({
      name: name,
      authorId: authorId,
    });
    return response.send(repository);
  }

  async update(request, response, next) {
    const repositoryId = Number(request.params.id);
    const name = request.body.name;
    const authorId = Number(request.currentUser.id);

    const repository = await Repos.findByPk(repositoryId);
    if (!repository) {
      return next(createError(400, `Repository with id=${ repositoryId } does not exist`));
    }

    const canActivate = request.ability.can(UpdatePermission, repository);
    if (!canActivate) {
      return next(createError(403, `Access denied!`));
    }

    const doesUserExist = !!(await User.findByPk(authorId));
    if (!doesUserExist) {
      return next(createError(400, `User with id=${ authorId } does not exist`));
    }

    const repositoryUpdateData = {
      id: repositoryId,
      name: name,
      authorId: authorId,
    };
    await Repos.update(repositoryUpdateData, { where: { id: repositoryId } });

    return response.send(repositoryUpdateData);
  }

  async remove(request, response, next) {
    const repositoryId = Number(request.params.id);
    const repository = await Repos.findByPk(repositoryId);
    if (!repository) {
      return next(createError(400, `Repository with id=${ repositoryId } does not exist`));
    }

    const canActivate = request.ability.can(DeletePermission, repository);
    if (!canActivate) {
      return next(createError(403, `Access denied!`));
    }

    await Repos.destroy({ where: { id: repositoryId } });
    return response.sendStatus(204);
  }
}