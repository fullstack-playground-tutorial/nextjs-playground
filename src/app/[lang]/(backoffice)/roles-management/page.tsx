import { getRoleService } from '@/app/core/server/context'
import Roles from './components/Roles';

export default async function Page(props: {
    searchParams?: Promise<{
        q?: string;
        page?: string;
        sort?: string;
        limit?: string;
        showModal?: boolean;
        id?: string;
        action?: "create" | "edit" | "delete";
    }>;
}) {
    const searchParams = await props.searchParams;

    const q = searchParams?.q || "";
    const currentPage = Number(searchParams?.page) || 1;
    // const limit = Number(searchParams?.limit) || 25;
    // const sort = searchParams?.sort || "created_at";

    const permissionsWithRoleIds = getRoleService().getPermissionsWithRoles({ tags: ["roles"] })

    return (
        <div className="p-4 dark:bg-surface-0 h-screen dark:text-primary max-w-300 mx-auto flex flex-col">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 mt-2">
                <h1 className="font-semibold text-accent-0 text-4xl">Role Management</h1>
            </div>
            {/* <Search keyword={q} size={limit} /> */}
            <Roles
                permissionsWithRoleIds={permissionsWithRoleIds}
                // pageSize={limit}
                currentPage={currentPage}
            />
        </div>
    )
}
