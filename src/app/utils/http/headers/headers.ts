import { Cookie, StoreRequestCookies } from "./constants";

export const getSetCookieFromResponse = (headers: Headers) => {
  let tokenObject: StoreRequestCookies = {
    accessToken: undefined,
    userId: undefined,
    refreshToken: undefined,
  };

  headers.getSetCookie().forEach((item) => {
    const props = item.split(";");

    if (props.length >= 1) {
      const propsPart = props[0].trim().split("=");
      const cookieName = propsPart[0].trim();

      if (Object.hasOwn(tokenObject, cookieName)) {
        const key = cookieName as keyof StoreRequestCookies;
        const cookieItem: Cookie = {
          value: propsPart[1] || "",
        };
        tokenObject[key] = cookieItem;

        // Parse properties
        for (let index = 1; index < props.length; index++) {
          const element = props[index].trim();
          const elementPart = element.split("=");
          elementPart[0] = elementPart[0].trim();

          // Convert to camel camelCase
          let keyProps =
            elementPart[0].charAt(0).toLowerCase() + elementPart[0].slice(1);

          if (keyProps.toLowerCase() === "max-age") {
            keyProps = "maxAge";
          }

          if (elementPart.length > 1) {
            // case available value (example: Expires=Wed, 21 Oct 2015 07:28:00 GMT)
            cookieItem[keyProps] = elementPart[1].trim();
          } else if (elementPart.length == 1 && elementPart[0]) {
            // Boolean attribute (example: HttpOnly, Secure)
            cookieItem[keyProps] = true;
          }
        }
      }
    }
  });

  return tokenObject;
};
