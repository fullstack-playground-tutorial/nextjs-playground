"use client";

// import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
// import LoadingProvider from "./loading/LoadingProvider";
import InternalizationProvider from "./internalization/InternalizationProvider";
import AlertProvider from "./alert/AlertProvider";
import ThemeProvider from "./theme/ThemeProvider";
// import AuthProvider from "./auth/AuthProvider";
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
      <ThemeProvider>
        <AlertProvider>{props.children}</AlertProvider>
      </ThemeProvider>
    </InternalizationProvider>
  );
};
