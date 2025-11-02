import { NextRequest, NextResponse } from "next/server";
import { localeService } from "./app/utils/resource/locales";
import { verifySession } from "./app/dal";

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
    locale = supportedLocales.find((loc) =>
      pathname.startsWith(`/${loc}`)
    );
  }

  const session = await verifySession();
  const pathType = pathIdentify(pathname, locale);
  console.log("session", session);
  console.log("pathType", pathType, pathname);

  if (session) {
    if (pathType === "public" && pathname.startsWith(`/${locale}/auth`)) {
      // evade auth when already login
      return NextResponse.redirect(new URL(`/${locale}`, request.url));
    }
    return NextResponse.next();
  } else {
    if (pathType === "public") {
      return NextResponse.next();
    }
    // not login redirect to /auth
    return NextResponse.redirect(new URL(`/${locale}/auth`, request.url));
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
