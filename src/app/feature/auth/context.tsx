"use client"
import { createContext, useActionState } from "react";
import { LoginCredentials } from "./auth";
import { logout } from "./actions";

interface AuthContextShape {
  user?: string;
  // hasPermission: (perms: string[]) => boolean;
  // login: (credentials: LoginCredentials) => Promise<number>;
  // isLoading: boolean;
  logoutAction: () => Promise<number>;
}

export const AuthContext = createContext<AuthContextShape | null>(null);

export function AuthProvider({
  children,
}: React.PropsWithChildren<{ logoutAction: () => Promise<number> }>) {
  return <AuthContext value={{ logoutAction: logout }}>{children}</AuthContext>;
}
