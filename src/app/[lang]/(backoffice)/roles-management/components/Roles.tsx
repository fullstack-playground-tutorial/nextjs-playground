"use client";
import { use, useState, useTransition } from "react";
import useToast from "@/app/components/Toast";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { deleteRole, PermissionsWithRoles } from "@/app/feature/role";
import { SearchBar } from "@/components/Search";
import Thead from "./Thead";
type Props = {
  // pageSize: number;
  permissionsWithRoleIds: Promise<PermissionsWithRoles>;
  currentPage: number;
};

export default function Roles({
  permissionsWithRoleIds,
  // pageSize,
  currentPage,
}: Props) {
  const { roles, permissions } = use(permissionsWithRoleIds);
  const [ChangeRoles, setChangeRole] = useState([]);
  const toast = useToast();
  const searchParams = useSearchParams();
  const { replace, back } = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();

  const handleDeleteRole = (id: string) => {
    startTransition(async () => {
      try {
        const res = await deleteRole(id);
        if (res > 0) {
          toast.addToast("success", `Successfully deleted topic ${id}`);
          back();
        } else {
          toast.addToast("error", "not found topic with id:" + id);
        }
      } catch (error: any) {
        toast.addToast("error", error.message);
      }
    });
  };

  const loadMore = () => {
    const params = new URLSearchParams(searchParams);
    params.set("page", currentPage + 1 + "");
    startTransition(() => {
      replace(pathname + "?" + params.toString());
    });
  };

  const handleChangeRolePermission = (
    e: React.ChangeEvent,
    roleId: string,
    permissionId: string
  ) => {};

  return (
    <>
      <div className=" mt-4 md:mt-6 lg:mt-8 xl:mt-10 mx-auto">
        <table className="table-fixed border-collapse border border-border-subtle w-full overflow-x-auto">
          <thead>
            <tr>
              <th className="p-2 min-w-16 border border-border">
                <SearchBar
                  placeHolder={"Search Permission"}
                  onSearch={function (term: string): void {
                    throw new Error("Function not implemented.");
                  }}
                />
              </th>
              {roles.map(({ id, title }) => (
                <Thead key={id} id={id} title={title} />
              ))}
            </tr>
          </thead>
          <tbody>
            {permissions.map((p) => (
              <tr className="dark:hover:bg-surface-1">
                <th className="px-3 py-2 min-w-16 border border-border text-sm text-left dark:text-primary dark:font-medium">
                  {p.title}
                </th>
                {roles.map((r) => (
                  <td
                    className="px-3 py-2 border border-border text-center"
                    key={r.id}
                  >
                    <input
                      type="checkbox"
                      name={r.id}
                      id={r.id}
                      className="size-3 appearance-none dark:checked:bg-accent-1 border border-secondary rounded"
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
      </div>
    </>
  );
}
