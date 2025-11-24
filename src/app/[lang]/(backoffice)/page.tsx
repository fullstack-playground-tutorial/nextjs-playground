import { getGoldService } from "@/app/core/server/context";
import Link from "next/link";

export default async function Page() {
  const data = await getGoldService().getGoldPrice("sjc");
  const table = () => {
    const firstItem = data[0];

    // Lấy danh sách các loại (1c, 1l, 5c...) dựa trên key buy
    const productKeys = Object.keys(firstItem)
      .filter((k) => k.startsWith("buy_"))
      .map((k) => k.replace("buy_", ""))
      .sort();

    return (
      <div className="overflow-hidden rounded">
        <table className="min-w-full dark:border dark:border-border text-center overflow-x-auto">
          <thead className="dark:bg-surface-1">
            <tr>
              <th className="px-4 py-2"></th>
              {productKeys.map((product) => (
                <th
                  key={product}
                  className="px-4 py-2 dark:border dark:border-border dark:text-accent-0 text-sm"
                >
                  {product}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {["buy", "sell"].map((type) => (
              <tr
                key={type}
                className={
                  type === "buy"
                    ? "dark:bg-surface-1 dark:border dark:border-border text-sm"
                    : "dark:bg-surface-2 dark:border dark:border-border text-sm"
                }
              >
                <td className="px-4 py-2 font-bold text-accent-0">
                  {type.toUpperCase()}
                </td>
                {productKeys.map((product) => {
                  const key = `${type}_${product}`;
                  return (
                    <td
                      key={key}
                      className="px-4 py-2 dark:border dark:border-border"
                    >
                      {Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                        maximumFractionDigits: 4,
                      }).format(firstItem[key])}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  return (
    <div className="flex flex-col items-center justify-center h-full relative">
      <div className="absolute top-0 left-0 w-full h-full">{table()}</div>
      <div className="flex flex-col items-center justify-center py-2 mb-2">
        <h1 className="text-4xl font-bold mb-4">Welcome to the Home Page</h1>
        <p className="text-lg dark:text-gray-600">
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
