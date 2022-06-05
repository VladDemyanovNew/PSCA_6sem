export function parseUserToDto(user) {
  return {
    id: user.id,
    name: user.name,
    role: user.role,
  };
}

export const UserRole = 'user';
export const AdminRole = 'admin';