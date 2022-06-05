import { Commit, Repos, User } from '../22-02.persistence.js';
import createError from 'http-errors';
import { CreatePermission, DeletePermission, UpdatePermission } from '../helpers/casl.helper.js';

export class CommitsController {

  constructor() {
  }

  async getAll(request, response, next) {
    const repositoryId = Number(request.params.id);
    const doesRepositoryExist = !!(await Repos.findByPk(repositoryId));
    if (!doesRepositoryExist) {
      return next(createError(400, `Repository with id=${ repositoryId } does not exist`));
    }

    const commits = await Commit.findAll({ where: { repoId: repositoryId } });
    return response.send(commits);
  }

  async getOne(request, response, next) {
    const repositoryId = Number(request.params.id);
    const commitId = Number(request.params.commitId);

    const doesRepositoryExist = !!(await Repos.findByPk(repositoryId));
    if (!doesRepositoryExist) {
      return next(createError(400, `Repository with id=${ repositoryId } does not exist`));
    }

    const commit = await Commit.findOne({
      where: { id: commitId, repoId: repositoryId },
    });
    if (!commit) {
      return next(createError(400, `Commit with id=${ commitId } does not exist`));
    }

    return response.send(commit);
  }

  async create(request, response, next) {
    const repositoryId = Number(request.params.id);
    const name = request.body.name;

    const repository = await Repos.findByPk(repositoryId, { include: User });
    if (!repository) {
      return next(createError(400, `Repository with id=${ repositoryId } does not exist`));
    }

    const commitCreateData = new Commit({
      name: name,
      repoId: repositoryId,
    });
    commitCreateData.dataValues.Repo = repository;

    const canActivate = request.ability.can(CreatePermission, commitCreateData);
    if (!canActivate) {
      return next(createError(403, `Access denied!`));
    }

    await commitCreateData.save();
    return response.send(commitCreateData);
  }

  async update(request, response, next) {
    const repositoryId = Number(request.params.id);
    const commitId = Number(request.params.commitId);
    const name = request.body.name;

    const doesSourceRepositoryExist = !!(await Repos.findByPk(repositoryId));
    if (!doesSourceRepositoryExist) {
      return next(createError(400, `Repository with id=${ repositoryId } does not exist`));
    }

    const commit = await Commit.findByPk(commitId, { include: Repos });
    if (!commit) {
      return next(createError(400, `Commit with id=${ commitId } does not exist`));
    }

    const canActivate = request.ability.can(UpdatePermission, commit);
    if (!canActivate) {
      return next(createError(403, `Access denied!`));
    }

    commit.name = name;
    await commit.save();

    return response.send(commit);
  }

  async remove(request, response, next) {
    const repositoryId = Number(request.params.id);
    const commitId = Number(request.params.commitId);

    const doesRepositoryExist = !!(await Repos.findByPk(repositoryId));
    if (!doesRepositoryExist) {
      return next(createError(400, `Repository with id=${ repositoryId } does not exist`));
    }

    const commit = await Commit.findByPk(commitId, { include: Repos });
    if (!commit) {
      return next(createError(400, `Commit with id=${ commitId } does not exist`));
    }

    const canActivate = request.ability.can(DeletePermission, commit);
    if (!canActivate) {
      return next(createError(403, `Access denied!`));
    }

    await Commit.destroy({
      where: {
        id: commitId,
        repoId: repositoryId,
      },
    });
    return response.send(204);
  }
}