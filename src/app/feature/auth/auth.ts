import { HttpResponse } from "@/app/utils/http/response";
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
  logout(
    deviceId: string,
    ip: string,
    userAgent: string
  ): Promise<number>;
  refresh(
    deviceId: string,
    ip: string,
    userAgent: string
  ): Promise<Cookie | undefined>;
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
