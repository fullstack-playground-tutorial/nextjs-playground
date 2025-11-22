import { createGenericService, GenericService } from "@/app/utils/service";
import { HTTPService } from "@/app/utils/http";
import { Permission, PermissionsWithRoles, Role, RoleFilter } from "./role";

export interface RoleService
  extends GenericService<Role, RoleFilter, undefined> {
  getPermissionsWithRoles(
    next?: NextFetchRequestConfig,
    authSkip?: boolean
  ): Promise<PermissionsWithRoles>;
  BulkUpdateRoles(
    roles: Role[],
    permissions: Permission[],
    next?: NextFetchRequestConfig,
    authSkip?: boolean
  ): Promise<number>;
}

export const createRoleService = (
  httpService: HTTPService,
  url: string
): RoleService => {
  const sv = createGenericService<Role, RoleFilter, undefined>(
    httpService,
    url
  );
  const getPermissionsWithRoles = async (
    next?: NextFetchRequestConfig,
    authSkip?: boolean
  ): Promise<PermissionsWithRoles> => {
    return httpService
      .get<PermissionsWithRoles>(url, { next, authSkip })
      .then((res) => res.body);
  };
  const bulkUpdateRoles = async (
    roles: Role[],
    permissions: Permission[],
    next?: NextFetchRequestConfig,
    authSkip?: boolean
  ): Promise<number> => {
    return httpService
      .post<number, PermissionsWithRoles>(
        url + "/bulk",
        { roles, permissions },
        {
          next,
          authSkip,
        }
      )
      .then((res) => res.body);
  };
  return {
    ...sv,
    getPermissionsWithRoles: getPermissionsWithRoles,
    BulkUpdateRoles: bulkUpdateRoles,
  };
};
