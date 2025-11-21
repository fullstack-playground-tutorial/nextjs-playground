"use server"

import { getRoleService } from "@/app/core/server/context";

export async function createRole() {

}

export async function deleteRole(id: string) {
    const res = await getRoleService().remove(id);
    return res;
}