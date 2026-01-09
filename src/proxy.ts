import { NextRequest, NextResponse, userAgent } from "next/server";
import { localeService } from "./app/utils/resource/locales";
import { getDeviceId, IP, verifySession } from "./app/dal";
import { PassportKeys } from "./app/utils/http/headers";
import { getAuthService } from "./app/core/server/context";

const publicRoutes: string[] = [
  "/auth",
  "/test",
  "/marketplace",
  "/eng-note",
  "",
];
const protectedRoutes: string[] = [
  "/chat",
  "/profile",
  "/search",
  "/topics",
  "roles-managment",
];
const defaultPath = "/";
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

export async function refreshSession(req: NextRequest) {
  const res = NextResponse.next();

  const ua = userAgent({ headers: req.headers }).ua;

  const [deviceId, ip] = await Promise.all([getDeviceId(), IP()]);

  if (deviceId.length == 0 || ua.length == 0 || ip.length == 0) {
    res.cookies.delete(PassportKeys.accessToken);
    res.cookies.delete(PassportKeys.refreshToken);
  } else {
    const newAccessToken = await getAuthService().refresh(deviceId, ip, ua);
    if (!newAccessToken) {
      res.cookies.delete(PassportKeys.accessToken);
      res.cookies.delete(PassportKeys.refreshToken);
    } else {
      res.cookies.set(PassportKeys.accessToken, newAccessToken.value, {
        httpOnly: newAccessToken.httpOnly,
        path: newAccessToken.path,
        sameSite: newAccessToken.sameSite,
        secure: newAccessToken.secure,
        expires:
          newAccessToken.expires && !isNaN(Date.parse(newAccessToken.expires))
            ? new Date(newAccessToken.expires)
            : undefined,
        maxAge: newAccessToken.maxAge
          ? Number(newAccessToken.maxAge)
          : undefined,
      });
    }
  }

  return res;
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
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = `/${locale}${pathname}`;
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
        return await refreshSession(request);
      } catch (error) {
        console.log("refresh failed: ", error);
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = `/${locale}${defaultPath}`;

        const res = NextResponse.redirect(redirectUrl);
        res.cookies.delete(PassportKeys.accessToken);
        res.cookies.delete(PassportKeys.refreshToken);
        return res;
      }
    }

    if (pathType === "public" && pathname.startsWith(`/${locale}/auth`)) {
      // evade auth when already login => redirect from login page to home page
      return NextResponse.redirect(new URL(`/${locale}`, request.url));
    }
    return NextResponse.next();
  } else {
    // case not login but can be access to public page => allow
    if (pathType === "public") {
      return NextResponse.next();
    } else {
      // not login and access to protected or invalid page => redirect to defaultPath
      return NextResponse.redirect(
        new URL(`/${locale}${defaultPath}`, request.url)
      );
    }
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
