"use server";

import { getRoleService } from "@/app/core/server/context";
import { Role, Permission } from "@/app/feature/role";
import { updateTag } from "next/cache";

export async function createRole(
  id: string,
  title: string,
  permissionIds?: string[]
) {
  try {
    await getRoleService().create({ id, title, permissions: permissionIds });
    updateTag("roles");
    return {
      successMsg: "Create role successfully",
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function updateRole(id: string, title: string) {
  try {
    await getRoleService().patch(id, { title });
    updateTag("roles");
    return {
      successMsg: "Update role successfully",
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteRole(id: string) {
  try {
    await getRoleService().remove(id);
    updateTag("roles");
    return {
      successMsg: "Delete role successfully",
    };
  } catch (error: any) {
    console.log(error);
    throw error;
  }
}

export async function setPermissions(roles: Role[], permissions: Permission[]) {
  try {
    await getRoleService().setPermissions(roles, permissions);
    updateTag("roles");
    return {
      successMsg: "set Permissions successfully",
    };
  } catch (error: any) {
    console.log(error);
    throw error;
  }
}
