import { Cookie, StoreRequestCookies } from "../../utils/http/headers";

export interface AuthService {
  login(
    email: string,
    password: string,
    userAgent: string,
    ip: string,
    deviceId: string
  ): Promise<StoreRequestCookies>;
  register(user: Account): Promise<number>;
  logout(deviceId: string, ip: string, userAgent: string): Promise<number>;
  refresh(
    deviceId: string,
    ip: string,
    userAgent: string
  ): Promise<Cookie | undefined>;
  me(): Promise<UserInfo>;
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

export type User = {
  id: string;
  email: string;
  username?: string;
  avatarUrl?: string;
  roleId?: string;
  phone?: string;
};

export type UserInfo = {
  user: User;
  modules: Module[];
  permissions: string[]; // direct permissions
  // overridePermissions?: string[]; // use + or - to add or remove permissions
};

export type Module = {
  id: string;
  title: string;
  url: string;
  permission?: string;
  icon?: string;
  children?: Module[];
};
