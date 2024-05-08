import {UserRole} from '../constants.ts';

export const useRoleCheck = (role_id: UserRole, roles: UserRole[]) => {
  return roles.includes(role_id);
};
