import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies"
import { cookies } from "next/headers"

export class HeaderType {
    static contentType = "Content-Type"
    static deviceId = "Device-Id"
    static userAgent = "User-Agent"
    static xForwardedFor = "X-Forwarded-For"
    static cookie = "Cookie"
    static setCookie = "Set-Cookie"
    static acceptLanguage = "AcceptLanguage"
}

export class ContentType {
    static applicationJson = "application/json"
    static applicationFormUrlEncoded = "application/x-www-form-urlencoded"
    static textPlain = "text/plain"
    static xml = "text/xml"
    static isJson(contentType: string) {
        return contentType.includes(ContentType.applicationJson)
    }
    static isFormUrlEncoded(contentType: string) {
        return contentType.includes(ContentType.applicationFormUrlEncoded)
    }
    static isText(contentType: string) {
        return contentType.includes(ContentType.textPlain)
    }
    static isXml(contentType: string) {
        return contentType.includes(ContentType.xml)
    }
    static isJsonOrFormUrlEncoded(contentType: string) {
        return ContentType.isJson(contentType) || ContentType.isFormUrlEncoded(contentType)
    }
    static isJsonOrFormUrlEncodedOrText(contentType: string) {
        return ContentType.isJson(contentType) || ContentType.isFormUrlEncoded(contentType) || contentType.includes(ContentType.textPlain)
    }
    static isJsonOrFormUrlEncodedOrTextOrXml(contentType: string) {
        return ContentType.isJson(contentType) || ContentType.isFormUrlEncoded(contentType) || contentType.includes(ContentType.textPlain) || contentType.includes(ContentType.xml)
    }
}

export interface Cookie {
    value: string
    secure?: boolean
    httpOnly?: boolean
    expires?: string
    [key: string]: any
}

/**
 * cookie send between client and server
 */
export class PassportKeys {
    static accessToken = 'accessToken'
    static userId = 'userId'
    static refreshToken = 'refreshToken'
}

/**
 * cookies store in browser 
 */
export interface StoreRequestCookies {
    accessToken?: Cookie
    refreshToken?: Cookie
    userId?: Cookie;

}
export const getSetCookieFromResponse = (headers: Headers) => {
    let tokenObject: StoreRequestCookies = {
        accessToken: undefined,
        userId: undefined,
        refreshToken: undefined,
    }
    headers.getSetCookie().forEach(item => {

        const props = item.split(";")
        if (props.length > 1) {
            const propsPart = props[0].split("=")

            if (Object.hasOwn(tokenObject, propsPart[0])) {

                const key = propsPart[0] as keyof StoreRequestCookies
                const cookieItem: Cookie = {
                    value: propsPart[1]
                }
                tokenObject[key] = cookieItem

                for (let index = 1; index < props.length; index++) {
                    const element = props[index];
                    const elementPart = element.split("=")
                    elementPart[0] = elementPart[0].trim()
                    const keyprops = elementPart[0].charAt(0).toLowerCase() + elementPart[0].slice(1)

                    if (elementPart.length > 1) {
                        cookieItem[keyprops] = elementPart[1]
                    } else if (elementPart.length == 1) {
                        cookieItem[keyprops] = true
                    }
                }
            }
        }

    })
    return tokenObject
}

export const getCookieHeader = () => {
    let cookieHeader = ""
    cookies().getAll().filter(item => item.name == PassportKeys.accessToken || item.name == PassportKeys.userId).forEach(item => {
        cookieHeader += parseCookieToString(item)
    })
    return cookieHeader
}

const parseCookieToString = (cookie: RequestCookie) => {
    return cookie.name + "=" + cookie.value + ";"
}