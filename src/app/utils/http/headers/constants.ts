// src/app/utils/http/headers/constants.ts

export class PassportKeys {
  static accessToken = "accessToken";
  static refreshToken = "refreshToken";
}

export const HeaderType = {
  contentType: "Content-Type",
  deviceId: "Device-Id",
  userAgent: "User-Agent",
  xForwardedFor: "X-Forwarded-For",
  cookie: "Cookie",
  setCookie: "Set-Cookie",
  acceptLanguage: "Accept-Language",
};

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

  static build(contentType: _ContentType, charset?: CharsetEncoding) {
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
    return this.isJson(contentType) || this.isFormUrlEncoded(contentType);
  }
}

export interface Cookie {
  value: string;
  secure?: boolean;
  httpOnly?: boolean;
  expires?: string;
  [key: string]: any;
}

export interface StoreRequestCookies {
  accessToken?: Cookie;
  refreshToken?: Cookie;
  userId?: Cookie;
}
