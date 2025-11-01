import { NextRequest, NextResponse } from "next/server";
import { localeService } from "./app/utils/resource/locales";
import { verifySession } from "./app/dal";

const publicRoute: string[] = ["/auth", "/test", "/marketplace", "/eng-note"];
const protectedRoute: string[] = ["/chat", "/profile", "/search", "/"];

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

function pathIdentify(
  pathname: string,
  locale?: string
): "public" | "protected" | "invalid" {
  const searchString = (path: string) => `${locale ? "/" + locale : ""}${path}`;
  if (publicRoute.some((path) => pathname.startsWith(searchString(path)))) {
    return "public";
  } else if (
    protectedRoute.some((path) => pathname.startsWith(searchString(path)))
  ) {
    return "protected";
  }
  return "invalid";
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const { locales, getLocale, currentLocale } = localeService;

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (!pathnameHasLocale) {
    const acceptLanguage = request.headers.get("accept-language") ?? undefined;
    const locale = getLocale(acceptLanguage);

    request.nextUrl.pathname = `/${locale}${pathname}`;

    return NextResponse.redirect(request.nextUrl);
  }

  const session = await verifySession();
  const pathType = pathIdentify(pathname);

  if (session) {
    switch (pathType) {
      case "public":
        // Handle if user already login, redirect to home page.
        if (pathname.startsWith(`/${currentLocale}/auth`)) {
          return NextResponse.redirect(
            new URL(`/${currentLocale}`, request.url)
          );
        } else {
          return NextResponse.next();
        }
      case "protected":
        return NextResponse.next();
      default:
        return NextResponse.redirect(new URL(`/${currentLocale}`, request.url));
    }
  } else {
    if (pathType == "public") {
      return NextResponse.next();
    } else {
      // Protected cannot access if not login.
      return NextResponse.redirect(
        new URL(`/${currentLocale}/auth`, request.url)
      );
    }
  }
}

interface AppPath {
  locale?: string;
  page?: string;
  subPage?: string;
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
