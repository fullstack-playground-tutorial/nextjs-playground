import { Suspense } from "react";
import Header from "../../(home)/components/Header";
import Sidebar from "../../(home)/components/Sidebar";
import Loading from "../../loading";

export default function MarketLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div className="w-full flex flex-row justify-between gap-4 p-4 h-[calc(100%-56px)]">
        <Sidebar />
        <Suspense fallback={<Loading />}>{children}</Suspense>
        <div className="right-0 top-0"></div>
      </div>
    </>
  );
}
