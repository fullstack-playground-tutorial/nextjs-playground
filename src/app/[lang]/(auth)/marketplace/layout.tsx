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
      <div className="w-full flex flex-justify-start p-4 h-[calc(100%-56px)]">
        <Suspense fallback={<Loading />}>
          <div className="flex justify-between w-full">{children}</div>
        </Suspense>
      </div>
    </>
  );
}
