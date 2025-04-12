import { HttpService } from "@/app/utils/http/http-default";
import { Account, AuthService } from "./auth";
import {
  ContentType,
  Cookie,
  getCookieHeader,
  getSetCookieFromResponse,
  HeaderType,
} from "@/app/utils/http/headers";
import { storeCookies } from "../actions";

export class AuthClient implements AuthService {
  constructor(private httpInstance: HttpService, private auth_url: string) {
    this.login = this.login.bind(this);
    this.register = this.register.bind(this);
    this.logout = this.logout.bind(this);
    this.refresh = this.refresh.bind(this);
  }

  async login(
    email: string,
    password: string,
    userAgent: string,
    ip: string,
    deviceId: string
  ): Promise<number> {
    return this.httpInstance
      .post<number, any>(
        `${this.auth_url}/login`,
        {
          email: email,
          password: password,
        },
        {
          headers: {
            [HeaderType.contentType]: ContentType.build("application/json", "utf-8"),
            [HeaderType.deviceId]: deviceId,
            [HeaderType.userAgent]: userAgent,
            [HeaderType.xForwardedFor]: ip,
          },
          cache: "no-cache",
        }
      )
      .then((res) => {
        const setCookies = getSetCookieFromResponse(res.headers);
        console.log("cookies: ", setCookies);

        storeCookies({
          accessToken: setCookies.accessToken,
          refreshToken: setCookies.refreshToken,
          userId: setCookies.userId,
        });
        return res.body;
      })
      .catch((e) => {
        throw e;
      });
  }

  async register(user: Account): Promise<number> {
    try {
      const res = await this.httpInstance.post<number, Account>(
        `${this.auth_url}/register`,
        user,
        {
          headers: {
            [HeaderType.contentType]: ContentType.build("application/json", "utf-8"),
          },
        }
      );

      return res.body ?? -1;
    } catch (err: unknown) {
      throw err;
    }
  }
  async logout(
    deviceId: string,
    ip: string,
    userAgent: string
  ): Promise<number> {
    try {
      const res = await this.httpInstance.get<number>(
        `${this.auth_url}/logout`,
        {
          headers: {
            [HeaderType.contentType]: ContentType.build("application/json", "utf-8"),
            [HeaderType.deviceId]: deviceId,
            [HeaderType.userAgent]: userAgent,
            [HeaderType.xForwardedFor]: ip,
            [HeaderType.cookie]: await getCookieHeader(),
          },
          cache: "no-cache",
        }
      );

      return res.body ?? -1;
    } catch (err: unknown) {
      throw err;
    }
  }

  // Refresh access token when token expired. Used in middleware and interceptor http. So, cookie should be resolved in action or router handler
  async refresh(
    deviceId: string,
    ip: string,
    userAgent: string
  ): Promise<Cookie | undefined> {
    try {
      const res = await this.httpInstance.get<number>(
        `${this.auth_url}/refresh`,
        {
          headers: {
            [HeaderType.contentType]: ContentType.build("application/json", "utf-8"),
            [HeaderType.deviceId]: deviceId,
            [HeaderType.userAgent]: userAgent,
            [HeaderType.xForwardedFor]: ip,
            [HeaderType.cookie]: await getCookieHeader(),
          },
          cache: "no-cache",
        }
      );

      const setCookies = getSetCookieFromResponse(res.headers);
      return setCookies.accessToken;
    } catch (err: unknown) {
      throw err;
    }
  }
}
