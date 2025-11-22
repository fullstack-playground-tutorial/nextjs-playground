import { getRoleService } from "@/app/core/server/context";
import Roles from "./components/Roles";

export default async function Page() {
  const permissionsWithRoleIds = getRoleService().getPermissionsWithRoles({
    tags: ["roles"],
  });

  return (
    <div className="p-4 dark:bg-surface-0 h-screen dark:text-primary max-w-300 mx-auto flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 mt-2">
        <h1 className="font-semibold text-accent-0 text-4xl">
          Role Management
        </h1>
      </div>
      <Roles permissionsWithRoleIds={permissionsWithRoleIds} />
    </div>
  );
}
