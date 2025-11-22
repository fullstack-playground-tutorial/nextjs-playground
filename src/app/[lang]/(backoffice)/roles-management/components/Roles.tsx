"use client";
import { use, useEffect, useMemo, useState, useTransition } from "react";
import useToast from "@/app/components/Toast";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  createRole,
  deleteRole,
  Permission,
  PermissionsWithRoles,
  Role,
  updateRoles,
} from "@/app/feature/role";
import { SearchBar } from "@/components/Search";
import Thead from "./Thead";
type Props = {
  permissionsWithRoleIds: Promise<PermissionsWithRoles>;
};

type InternalState = {
  draft: {
    roles: Role[];
    permissions: Permission[];
  };
  filterPerms: Permission[];
  searchTerm: string;
  newRole?: Role;
  showNewRoleCol: boolean;
};

export default function Roles({ permissionsWithRoleIds }: Props) {
  const { roles, permissions } = use(permissionsWithRoleIds);
  const toast = useToast();
  const { back } = useRouter();
  const [state, setState] = useState<InternalState>({
    draft: {
      roles,
      permissions,
    },
    filterPerms: permissions,
    searchTerm: "",
    showNewRoleCol: false,
  });

  const { draft, filterPerms, searchTerm, showNewRoleCol } = state;

  const addRoleCols = (index: number) => {
    setState((prev) => ({
      ...prev,
      draft: {
        ...prev.draft,
        roles: [
          ...prev.draft.roles.slice(0, index),
          { title: "", id: "" },
          ...prev.draft.roles.slice(index),
        ],
      },
    }));
  };

  const handleChangeRolePermission = (
    e: React.ChangeEvent,
    roleId: string,
    permissionId: string
  ) => {
    const newPerms = draft.permissions.map((p) => {
      if (p.permissionId === permissionId) {
        return {
          ...p,
          roleIds: p.roleIds.includes(roleId)
            ? p.roleIds.filter((id) => id !== roleId)
            : [...p.roleIds, roleId],
        };
      }
      return p;
    });
    setState((prev) => ({
      ...prev,
      draft: {
        ...prev.draft,
        permissions: newPerms,
      },
    }));
  };

  const handleOnQueryChange = (term: string) => {
    if (term.trim() !== "") {
      const filteredPerms = draft.permissions.filter((p) =>
        p.title.toLowerCase().includes(term.toLowerCase())
      );
      setState((prev) => ({
        ...prev,
        filterPerms: filteredPerms,
        searchTerm: term,
      }));
    } else {
      setState((prev) => ({
        ...prev,
        filterPerms: draft.permissions,
        searchTerm: term,
      }));
    }
  };

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const { successMsg } = await updateRoles(draft.roles, draft.permissions);
      toast.addToast("success", successMsg);
    } catch (error) {
      console.log(error);
      toast.addToast("error", "Update roles failed");
    }
  };

  const handleRoleEdited = async (id: string, title: string) => {
    const role = roles.find((r) => r.id === id);
    const isDraftChanged = role?.title !== title;

    if (!isDraftChanged) {
      return false;
    }

    const newRoles = draft.roles.map((r) => {
      if (r.id === id) {
        return {
          ...r,
          title,
        };
      }
      return r;
    });

    setState((prev) => ({
      ...prev,
      draft: {
        ...prev.draft,
        roles: newRoles,
      },
      isRoleDraft: true,
    }));
    return true;
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    setState((prev) => ({
      ...prev,
      draft: {
        roles,
        permissions,
      },
    }));
  };

  useEffect(() => {
    setState((prev) => ({
      ...prev,
      draft: {
        roles,
        permissions,
      },
    }));
  }, [roles, permissions]);

  const isPermsDraftChanging = useMemo(() => {
    if (draft.permissions.length !== permissions.length) {
      return true;
    }

    return draft.permissions.some(
      (p) =>
        p.roleIds.length !==
        permissions.find((perm) => perm.permissionId === p.permissionId)
          ?.roleIds.length
    );
  }, [draft.permissions]);

  const handleCreateCancel = () => {
    setState((prev) => ({ ...prev, showNewRoleCol: false }));
  };

  const handleRoleCreate = async (id: string, title: string) => {
    const index = state.draft.roles.findIndex((i) => i.id == id);
    if (index != -1) {
      toast.addToast("error", "Role id already exists");
      return false;
    }

    try {
      const { successMsg } = await createRole(id, title);
      toast.addToast("success", successMsg);
      setState((prev) => ({
        ...prev,
        showNewRoleCol: false,
        draft: { ...prev.draft, roles: [...prev.draft.roles, { id, title }] },
      }));
      return true;
    } catch (error) {
      console.log(error);
      toast.addToast("error", "Create role failed");
      return false;
    }
  };

  useEffect(() => {
    if (searchTerm.trim() !== "") {
      const filteredPerms = draft.permissions.filter((p) =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setState((prev) => ({ ...prev, filterPerms: filteredPerms }));
    } else {
      setState((prev) => ({ ...prev, filterPerms: draft.permissions }));
    }
  }, [draft.permissions, searchTerm]);

  return (
    <>
      <div className=" mt-4 md:mt-6 lg:mt-8 xl:mt-10 mx-auto flex flex-col gap-4 justify-center items-start">
        <button
          type="button"
          className="btn btn-sm dark:bg-accent-0 dark:hover:bg-accent-1 dark:hover:text-primary hover:bg-surface-1 transition"
          onClick={() =>
            setState((prev) => ({ ...prev, showNewRoleCol: true }))
          }
        >
          + New Role
        </button>
        <table className="table-fixed border-collapse border border-border-subtle w-full overflow-x-auto">
          <thead>
            <tr>
              <th className="p-2 min-w-16 border border-border">
                <SearchBar
                  placeHolder={"Search Permission"}
                  onQueryChange={handleOnQueryChange}
                />
              </th>
              {showNewRoleCol && (
                <Thead
                  id="new"
                  title="New"
                  onSetProperties={handleRoleCreate}
                  mode="create"
                  onCancel={handleCreateCancel}
                />
              )}
              {draft.roles.map(({ id, title }) => (
                <Thead
                  key={id}
                  id={id}
                  title={title}
                  onSetProperties={handleRoleEdited}
                />
              ))}
            </tr>
          </thead>
          <tbody>
            {filterPerms.map((p) => (
              <tr className="dark:hover:bg-surface-1" key={p.permissionId}>
                <th className="px-3 py-2 min-w-16 border border-border text-sm text-left dark:text-primary dark:font-medium">
                  {p.title}
                </th>
                {showNewRoleCol && (
                  <td className="px-3 py-2 border border-border text-center">
                    <input
                      type="checkbox"
                      name="new"
                      id="new"
                      className="size-3 appearance-none dark:checked:bg-accent-1 border border-secondary rounded cursor-pointer"
                      checked={p.roleIds.includes("new")}
                      onChange={(e) =>
                        handleChangeRolePermission(e, "new", p.permissionId)
                      }
                    />
                  </td>
                )}
                {draft.roles.map((r) => (
                  <td
                    className="px-3 py-2 border border-border text-center"
                    key={r.id}
                  >
                    <input
                      type="checkbox"
                      name={r.id}
                      id={r.id}
                      className="size-3 appearance-none dark:checked:bg-accent-1 border border-secondary rounded cursor-pointer"
                      checked={p.roleIds.includes(r.id)}
                      onChange={(e) =>
                        handleChangeRolePermission(e, r.id, p.permissionId)
                      }
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div
          className="flex flex-row gap-2 mt-4 items-center w-full justify-center"
          hidden={!isPermsDraftChanging}
        >
          <button
            type="button"
            className="btn btn-sm dark:border dark:border-border-subtle dark:text-primary dark:hover:bg-secondary transition"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-sm dark:bg-accent-1 dark:text-primary dark:hover:bg-accent-0 transition"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </>
  );
}
