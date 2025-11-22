"use server";

import { getRoleService } from "@/app/core/server/context";
import { Role, Permission } from "@/app/feature/role";
import { updateTag } from "next/cache";

export async function createRole(id: string, title: string) {
  try {
    await getRoleService().create({ id, title });
    updateTag("roles");
    return {
      successMsg: "Create role successfully",
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

export async function updateRoles(roles: Role[], permissions: Permission[]) {
  try {
    await getRoleService().BulkUpdateRoles(roles, permissions);
    updateTag("roles");
    return {
      successMsg: "Update roles successfully",
    };
  } catch (error: any) {
    console.log(error);
    throw error;
  }
}
