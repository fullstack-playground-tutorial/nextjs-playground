// import { SessionProvider } from "next-auth/react";
// import LoadingProvider from "./loading/LoadingProvider";
import AlertProvider from "./alert/AlertProvider";
import { AuthProvider, logout } from "@/app/feature/auth";
import { ThemeProvider } from "@/app/components/Theme/context";
import { ToastProvider } from "@/components/Toast";
// import SearchProvider from "./search/SearchProvider";
// export * from "./alert/AlertProvider";
// export * from "./loading/LoadingProvider";
// export * from "./auth/AuthProvider";
export interface Props {
  children: React.ReactNode;
  lang?: string;
}

export const Providers = (props: Props) => {
  return (
    <AuthProvider logoutAction={logout}>
      <ThemeProvider>
        <ToastProvider>
          <AlertProvider>{props.children}</AlertProvider>
        </ToastProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};
