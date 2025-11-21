import Link from "next/link";

export default async function Page() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="flex flex-col items-center justify-center py-2 mb-2">
        <h1 className="text-4xl font-bold mb-4">Welcome to the Home Page</h1>
        <p className="text-lg text-gray-600">
          This is the main landing page of the application.
        </p>
      </div>
      <div className="flex flex-row justify-center gap-2 items-center flex-nowrap">
        <Link
          href="/cinematic"
          className="px-2 cursor-pointer text-sm font-semibold border dark:border-tertiary-1 py-1 rounded dark:hover:text-accent-0 hover:border-accent-0 transition"
        >
          Cinematic
        </Link>
        <Link
          href="/admin/roles"
          className="cursor-pointer text-sm font-semibold border px-2 dark:border-tertiary-1 py-1 rounded dark:hover:text-accent-0 hover:border-accent-0 transition"
        >
          Role
        </Link>
        <Link
          href="/topics/topic-management"
          className="cursor-pointer text-sm font-semibold border px-2 dark:border-tertiary-1 py-1 rounded dark:hover:text-accent-0 hover:border-accent-0 transition"
        >
          Topic
        </Link>
      </div>
    </div>
  );
}
