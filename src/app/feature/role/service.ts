import { createGenericService, GenericService } from "@/app/utils/service";
import { HTTPService } from "@/app/utils/http";
import { Permission, PermissionsWithRoles, Role, RoleFilter } from "./role";

export interface RoleService extends GenericService<Role, RoleFilter, "id"> {
  getPermissionsWithRoles(next?: NextFetchRequestConfig, authSkip?: boolean): Promise<PermissionsWithRoles>
}

export const createRoleService = (
  httpService: HTTPService,
  url: string
): RoleService => {
  const sv = createGenericService<Role, RoleFilter, "id">(httpService, url);
  const getPermissionsWithRoles = async (next?: NextFetchRequestConfig, authSkip?: boolean): Promise<PermissionsWithRoles> => {
    return httpService.get<PermissionsWithRoles>(url, { next, authSkip }).then(res => res.body);
  }
  return { ...sv, getPermissionsWithRoles: getPermissionsWithRoles }
};
