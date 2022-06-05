import caslPkg from 'casl';
import { AdminRole, UserRole } from './user.helper.js';

const { Ability, AbilityBuilder } = caslPkg;

export const ReadPermission = 'read';
export const CreatePermission = 'create';
export const UpdatePermission = 'update';
export const DeletePermission = 'delete';

export function defineAbilitiesForUser(jwtPayload) {
  const { rules, can } = AbilityBuilder.extract();

  switch (jwtPayload?.role) {
    case UserRole:
      can(ReadPermission, ['Repos', 'Commit']);
      can(ReadPermission, ['User'], { id: jwtPayload.id });
      can(CreatePermission, ['Repos']);
      can(CreatePermission, ['Commit'], { Repo: { authorId: jwtPayload.id } });
      can(UpdatePermission, ['Repos'], { authorId: jwtPayload.id });
      can(UpdatePermission, ['Commit'], { Repo: { authorId: jwtPayload.id } });
      can(DeletePermission, ['Commit'], { Repo: { authorId: jwtPayload.id } });
      break;
    case AdminRole:
      can([
        ReadPermission,
        CreatePermission,
        DeletePermission,
        UpdatePermission,
      ], [
        'Repos',
        'Commit',
        'User',
      ]);
      break;
    default:
      can(ReadPermission, ['Commit', 'Repos']);
      break;
  }

  return new Ability(rules);
}
