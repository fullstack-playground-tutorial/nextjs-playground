import { SearchFilter } from "@/app/utils/service";

export type Role = {
  id: string;
  title: string;
  permissions?: string[];
  canEdit?: boolean;
};

export type Permission = {
  permissionId: string;
  title: string;
  roleIds: string[];
};

export type PermissionsWithRoles = { roles: Role[]; permissions: Permission[] };

export interface RoleFilter extends SearchFilter {}
