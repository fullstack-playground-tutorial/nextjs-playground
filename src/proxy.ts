import { NextRequest, NextResponse, userAgent } from "next/server";
import { getDeviceId, IP, verifySession } from "./app/dal";
import { PassportKeys } from "./app/utils/http/headers";
import { getAuthService } from "./app/core/server/context";
import { getLocaleService } from "./app/utils/resource/locales";

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
  "/settings",
  "/tags",
  "/film-management",
  "roles-managment",
];
const defaultPath = "/";
function pathIdentify(
  pathname: string,
  locale?: string,
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
  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;

  const { getSupportLocales, getLocale, changeLanguage } = getLocaleService();
  const supportedLocales = getSupportLocales();

  // 1. Detect if the URL already has a locale or a prefix of it
  const pathParts = pathname.split("/");
  const localeSegment = pathParts[1];

  const matchedLocale = localeSegment
    ? supportedLocales.find(
        (loc) => loc === localeSegment || loc.startsWith(localeSegment),
      )
    : undefined;

  const pathnameHasLocale =
    !!matchedLocale &&
    (pathname.startsWith(`/${localeSegment}/`) ||
      pathname === `/${localeSegment}`);

  let locale: string;

  if (!pathnameHasLocale) {
    // 2. If no locale in URL, try Cookie -> Browser Lang -> Default
    locale =
      cookieLocale ||
      getLocale(request.headers.get("accept-language") ?? undefined);

    // Safety check for locale validity
    if (!supportedLocales.includes(locale as any)) {
      const found = supportedLocales.find((l) => l.startsWith(locale));
      locale = found || "en-US";
    }

    const redirectUrl = request.nextUrl.clone();
    // Prevent double locale segments if the first segment was an invalid short code
    const actualPath = matchedLocale
      ? pathname.replace(`/${localeSegment}`, "")
      : pathname;
    redirectUrl.pathname = `/${locale}${actualPath === "" ? "/" : actualPath}`;

    const response = NextResponse.redirect(redirectUrl);
    response.cookies.set("NEXT_LOCALE", locale);
    return response;
  } else {
    // 3. URL has locale, make sure it's the full one (e.g., /vi/ -> /vi-VN/)
    locale = matchedLocale as string;

    if (localeSegment !== locale) {
      const redirectUrl = request.nextUrl.clone();
      pathParts[1] = locale;
      redirectUrl.pathname = pathParts.join("/");
      const response = NextResponse.redirect(redirectUrl);
      response.cookies.set("NEXT_LOCALE", locale);
      return response;
    }
  }

  // Ensure singleton is in sync for this request's server logic
  changeLanguage(locale);

  const pathType = pathIdentify(pathname, locale);
  const session = await verifySession();

  let response = NextResponse.next();

  // case logined
  if (session) {
    // if token expired => rotate token
    if (session == "refresh") {
      try {
        response = await refreshSession(request);
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
      return NextResponse.redirect(new URL(`/${locale}`, request.url));
    }
  } else {
    if (pathType !== "public") {
      return NextResponse.redirect(
        new URL(`/${locale}${defaultPath}`, request.url),
      );
    }
  }

  // Consistent cookie setting on every successful response
  response.cookies.set("NEXT_LOCALE", locale);
  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
