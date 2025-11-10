import { NextRequest, NextResponse } from "next/server";
import { localeService } from "./app/utils/resource/locales";
import { verifySession } from "./app/dal";
import { refreshSession } from "./app/feature/auth";

const publicRoutes: string[] = ["/auth", "/test", "/marketplace", "/eng-note"];
const protectedRoutes: string[] = ["/chat", "/profile", "/search", "/"];

function pathIdentify(
  pathname: string,
  locale?: string
): "public" | "protected" | "invalid" {
  const prefix = locale ? `/${locale}` : "";

  const cleanPath =
    pathname !== "/" && pathname.endsWith("/")
      ? pathname.slice(0, -1)
      : pathname;

  const matchPath = (paths: string[]) =>
    paths.some((path) => {
      if (path === "") {
        // Home page -> "/", "/vi", "/en"
        return cleanPath === "/" || cleanPath === prefix;
      }
      const fullPath = `${prefix}${path}`;
      return cleanPath === fullPath || cleanPath.startsWith(`${fullPath}/`);
    });

  if (matchPath(publicRoutes)) return "public";
  if (matchPath(protectedRoutes)) return "protected";
  return "invalid";
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-query-string", request.nextUrl.searchParams.toString());
  requestHeaders.set("x-pathname", pathname);

  const { getSupportLocales, getLocale } = localeService;

  const supportedLocales = getSupportLocales();
  const pathnameHasLocale = supportedLocales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  let locale: string | undefined;

  if (!pathnameHasLocale) {
    const acceptLanguage = request.headers.get("accept-language") ?? undefined;
    locale = getLocale(acceptLanguage);
    const redirectUrl = new URL(`/${locale}${pathname}`, request.url);
    return NextResponse.redirect(redirectUrl);
  } else {
    locale = supportedLocales.find((loc) => pathname.startsWith(`/${loc}`));
  }

  const pathType = pathIdentify(pathname, locale);

  const session = await verifySession();

  // case logined
  if (session) {
    // if token expired => rotate token
    if (session == "refresh") {
      try {
        await refreshSession();
      } catch (error) {
        console.log("refresh failed: ", error);
        return NextResponse.redirect(new URL(`/${locale}/auth`, request.url));
      }
    }

    if (pathType === "public" && pathname.startsWith(`/${locale}/auth`)) {
      // evade auth when already login => redirect from login page to home page
      return NextResponse.redirect(new URL(`/${locale}`, request.url));
    }
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } else {
    // case not login but can be access to public page
    if (pathType === "public") {
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    }
    // not login and access to protected page => redirect to /auth
    return NextResponse.redirect(new URL(`/${locale}/auth`, request.url));
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
