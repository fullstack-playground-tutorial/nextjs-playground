import Link from "next/link";
import { useRouter } from "next/navigation";

type Props = {
  title?: string;
  description?: string;
};

export default function Error403({
  title = "403 — Forbidden",
  description = "You don't have permission to access this resource.",
}: Props) {
    const router = useRouter();

  return (
    <main
      className="min-h-screen flex items-center justify-center p-8 bg-gray-50 text-gray-900 box-border"
      role="main"
      aria-labelledby="error-title"
    >
      <section
        className="max-w-3xl w-full bg-white rounded-xl p-8 shadow-lg flex gap-6 items-center"
        aria-describedby="error-desc"
      >
        <div
          className="w-36 h-36 flex-shrink-0 flex items-center justify-center rounded-lg bg-gradient-to-br from-amber-50 to-pink-50"
          aria-hidden
        >
          <svg
            width="84"
            height="84"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-gray-900"
          >
            <rect
              x="3"
              y="10"
              width="18"
              height="11"
              rx="2"
              stroke="currentColor"
              strokeWidth="1.2"
            />
            <path
              d="M7 10V8a5 5 0 0 1 10 0v2"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            <circle cx="12" cy="15" r="1.6" fill="currentColor" />
          </svg>
        </div>

        <div className="flex-1">
          <h1
            id="error-title"
            className="text-2xl md:text-3xl font-semibold leading-tight m-0"
          >
            {title}
          </h1>

          <p id="error-desc" className="mt-2 mb-5 text-gray-600">
            {description}
          </p>

          <div className="flex gap-3 flex-wrap">
            <button
              type="button"
              onClick={() => {
                router.back();
              }}
              className="cursor-pointer inline-flex items-center px-4 py-2 rounded-md text-white bg-gradient-to-b from-teal-500 to-cyan-600 hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-cyan-300"
            >
              Go back
            </button>

            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 rounded-md text-gray-600 bg-transparent border border-gray-100 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
            >
              Go to home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
