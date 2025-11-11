"use server";
import { headers } from "next/headers";
import Link from "next/link";

export default async function NotFound() {
  return (
    <div className="flex justify-center h-screen items-center flex-col drop-shadow-sm">
      <div>URL not found</div>
      <div>
        Redirect to{" "}
        <Link href={{ pathname: "/" }} className="bold">
          Home page
        </Link>
      </div>
    </div>
  );
}
