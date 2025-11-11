// import { SessionProvider } from "next-auth/react";
// import LoadingProvider from "./loading/LoadingProvider";
import InternalizationProvider from "./internalization/InternalizationProvider";
import AlertProvider from "./alert/AlertProvider";
import { AuthProvider, logout } from "@/app/feature/auth";
import { ThemeProvider } from "@/app/components/Theme/context";
import { ToastProvider } from "@/components/Toast";
// import SearchProvider from "./search/SearchProvider";
// export * from "./alert/AlertProvider";
// export * from "./loading/LoadingProvider";
export * from "./internalization/InternalizationProvider";
// export * from "./auth/AuthProvider";
export interface Props {
  children: React.ReactNode;
}

export const Providers = (props: Props) => {
  return (
    <InternalizationProvider>
      <AuthProvider logoutAction={logout}>
        <ThemeProvider>
          <ToastProvider>
            <AlertProvider>{props.children}</AlertProvider>
          </ToastProvider>
        </ThemeProvider>
      </AuthProvider>
    </InternalizationProvider>
  );
};
