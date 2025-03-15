import { NextRequest, NextResponse } from "next/server";
import { getLocaleService } from "./app/utils/resource/locales";

const publicRoute: string[] = ["/", "/login", "/sign-up", "/marketplace"];
const protectedRoute: string[] = [];

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const locale = getLocaleService().currentLocale;

  const appPath = mapPath(request);

  // Redirect to default page if URL is invalid and redirect if url uncontained locale in path.
  if (!appPath || !appPath.locale) {
    const pathType = pathIdentify(pathname);
    console.log("path type: ", pathType);
    
    switch (pathType) {
      case "invalid":
        request.nextUrl.pathname = `/${locale}`;
        break;
      case "public":
      case "protected":
        request.nextUrl.pathname = `/${locale}${pathname}`;
        break;
    }
    return NextResponse.redirect(request.nextUrl);
  }

  return NextResponse.next();
}

interface AppPath {
  locale?: string;
  page?: string;
  subPage?: string;
}

function mapPath(request: NextRequest): Partial<AppPath> | undefined {
  const regex = new RegExp(
    "^\\/(?<locale>([a-z]{2}-[A-Z]{2}))(\\/|((?<page>\\/[a-z0-9-_]+)(\\/|(?<subPage>\\/.+))?))?$",
    "g"
  );

  const res = regex.exec(request.nextUrl.pathname);
  if (res == null) {
    return undefined;
  }

  const group = res.groups as Partial<AppPath>;
  group.page = group.page ?? "/";
  return group;
}

function pathIdentify(pathname: string): "public" | "protected" | "invalid" {
  if (publicRoute.some((path) => pathname.startsWith(path))) {
    return "public";
  } else if (protectedRoute.some((path) => pathname.startsWith(path))) {
    return "protected";
  }
  return "invalid";
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
