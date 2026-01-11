import { Account, AuthService, UserInfo } from "./auth";
import {
  ContentType,
  Cookie,
  getCookieHeader,
  getSetCookieFromResponse,
  HeaderType,
  StoreRequestCookies,
} from "@/app/utils/http/headers";
import { storeCookie } from "../actions";
import { HTTPService } from "@/app/utils/http";

export class AuthClient implements AuthService {
  constructor(private httpInstance: HTTPService, private auth_url: string) {
    this.login = this.login.bind(this);
    this.register = this.register.bind(this);
    this.logout = this.logout.bind(this);
    this.refresh = this.refresh.bind(this);
    this.me = this.me.bind(this);
  }

  async login(
    email: string,
    password: string,
    userAgent: string,
    ip: string,
    deviceId: string
  ): Promise<StoreRequestCookies> {
    return this.httpInstance
      .post<number, any>(
        `${this.auth_url}/login`,
        {
          email: email,
          password: password,
        },
        {
          authSkip: true,
          headers: {
            [HeaderType.contentType]: ContentType.build(
              "application/json",
              "utf-8"
            ),
            [HeaderType.deviceId]: deviceId,
            [HeaderType.userAgent]: userAgent,
            [HeaderType.xForwardedFor]: ip,
            apiKey: process.env.KONG_AUTH_APIKEY || "",
          },
          credentials: "include",
          cache: "no-cache",
        }
      )
      .then(async (res) => {
        // get Set-cookie from response
        const setCookies = getSetCookieFromResponse(res.headers)
        return setCookies
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
          authSkip: true,
          headers: {
            [HeaderType.contentType]: ContentType.build(
              "application/json",
              "utf-8"
            ),
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
          authSkip: true,
          headers: {
            [HeaderType.contentType]: ContentType.build(
              "application/json",
              "utf-8"
            ),
            [HeaderType.deviceId]: deviceId,
            [HeaderType.userAgent]: userAgent,
            [HeaderType.xForwardedFor]: ip,
            [HeaderType.cookie]: await getCookieHeader(),
          },
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
          _isRefresh: true,
          authSkip: true,
          headers: {
            [HeaderType.contentType]: ContentType.build(
              "application/json",
              "utf-8"
            ),
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

  async me(): Promise<UserInfo> {
    try {
      const res = await this.httpInstance.get<UserInfo>(this.auth_url + "/me", {
        authSkip: true,
        headers: {
          [HeaderType.contentType]: ContentType.build(
            "application/json",
            "utf-8"
          ),
          [HeaderType.cookie]: await getCookieHeader(),
        },
        credentials: "include",
        cache: "no-cache",
      });

      return res.body;
    } catch (error) {
      throw error;
    }
  }
}

// Add: helper to create a mock, valid account for registration validation
export const createMockValidAccount = (
  overrides?: Partial<Account>
): Account => {
  const base: Account = {
    email: "john.doe@example.com",
    username: "john_doe",
    password: "Secret1",
    confirmPassword: "Secret1",
    phone: "123-456-7890",
  };

  const merged: Account = { ...base, ...(overrides ?? {}) };

  // If overrides changed password without confirm, keep them matched
  if (merged.password && !overrides?.confirmPassword) {
    merged.confirmPassword = merged.password;
  }

  return merged;
};
