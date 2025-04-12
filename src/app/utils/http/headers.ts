import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";

export class HeaderType {
  static contentType = "Content-Type";
  static deviceId = "Device-Id";
  static userAgent = "User-Agent";
  static xForwardedFor = "X-Forwarded-For";
  static cookie = "Cookie";
  static setCookie = "Set-Cookie";
  static acceptLanguage = "AcceptLanguage";
}

type CharsetEncoding = "utf-8" | "utf-16" | "utf-32" | "ascii";
type _ContentType =
  | "application/json"
  | "application/x-www-form-urlencoded"
  | "text/plain"
  | "text/xml";

export class ContentType {
  private static readonly TYPES = {
    json: "application/json",
    form: "application/x-www-form-urlencoded",
    text: "text/plain",
    xml: "text/xml",
  };

static isJson(contentType: string) {
    return contentType.includes(this.TYPES.json);
  }

  static build(
    contentType: _ContentType,
    charset?: CharsetEncoding
  ) {
    return `${contentType}${charset ? `; charset=${charset}` : ""}`;
  }
  static isFormUrlEncoded(contentType: string) {
    return contentType.includes(this.TYPES.form);
  }
  static isText(contentType: string) {
    return contentType.includes(this.TYPES.text);
  }
  static isXml(contentType: string) {
    return contentType.includes(this.TYPES.xml);
  }
  static isJsonOrFormUrlEncoded(contentType: string) {
    return (
      ContentType.isJson(contentType) ||
      ContentType.isFormUrlEncoded(contentType)
    );
  }
}

export interface Cookie {
  value: string;
  secure?: boolean;
  httpOnly?: boolean;
  expires?: string;
  [key: string]: any;
}

/**
 * cookie send between client and server
 */
export class PassportKeys {
  static accessToken = "accessToken";
  static userId = "userId";
  static refreshToken = "refreshToken";
}

/**
 * cookies store in browser
 */
export interface StoreRequestCookies {
  accessToken?: Cookie;
  refreshToken?: Cookie;
  userId?: Cookie;
}
export const getSetCookieFromResponse = (headers: Headers) => {
  let tokenObject: StoreRequestCookies = {
    accessToken: undefined,
    userId: undefined,
    refreshToken: undefined,
  };
  headers.getSetCookie().forEach((item) => {
    const props = item.split(";");
    if (props.length > 1) {
      const propsPart = props[0].split("=");

      if (Object.hasOwn(tokenObject, propsPart[0])) {
        const key = propsPart[0] as keyof StoreRequestCookies;
        const cookieItem: Cookie = {
          value: propsPart[1],
        };
        tokenObject[key] = cookieItem;

        for (let index = 1; index < props.length; index++) {
          const element = props[index];
          const elementPart = element.split("=");
          elementPart[0] = elementPart[0].trim();
          const keyProps =
            elementPart[0].charAt(0).toLowerCase() + elementPart[0].slice(1);

          if (elementPart.length > 1) {
            cookieItem[keyProps] = elementPart[1];
          } else if (elementPart.length == 1) {
            cookieItem[keyProps] = true;
          }
        }
      }
    }
  });
  return tokenObject;
};

export const getCookieHeader = async () => {
  let cookieHeader = "";
  const cookieService = await cookies();
  cookieService
    .getAll()
    .filter(
      (item) =>
        item.name == PassportKeys.accessToken ||
        item.name == PassportKeys.userId
    )
    .forEach((item) => {
      cookieHeader += parseCookieToString(item);
    });
  return cookieHeader;
};

const parseCookieToString = (cookie: RequestCookie) => {
  return cookie.name + "=" + cookie.value + ";";
};
