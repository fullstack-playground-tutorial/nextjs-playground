import { HTTPResponse } from "@/app/utils/http/response";
import { Cookie } from "../../utils/http/headers";

export interface AuthService {
  login(
    email: string,
    password: string,
    userAgent: string,
    ip: string,
    deviceId: string
  ): Promise<number>;
  register(user: Account): Promise<number>;
  logout(deviceId: string, ip: string, userAgent: string): Promise<number>;
  refresh(
    deviceId: string,
    ip: string,
    userAgent: string
  ): Promise<Cookie | undefined>;
  me(): Promise<AuthUser | null>;
}

export interface Token {
  accessToken: string;
  refreshToken: string;
  userId: string;
  tokenType: string;
  expires: number;
}

export interface Account {
  id?: string;
  username?: string;
  password?: string;
  confirmPassword?: string;
  email?: string;
  phone?: string;
}

export type AuthUser = {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  roleId?: string;
  // overridePermissions?: string[]; // use + or - to add or remove permissions
  permissions: string[]; // direct permissions
};

export type LoginCredentials = {
  email: string;
  password: string;
  rememberMe?: boolean;
};
