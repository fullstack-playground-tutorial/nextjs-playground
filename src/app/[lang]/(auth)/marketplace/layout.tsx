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
      <div className="w-full flex flex-row justify-start gap-4 p-4 h-[calc(100%-56px)]">
        <div className="basis-1/5"><Sidebar/></div>
        <Suspense fallback={<Loading />}>
          <div className="basis-3/5 flex justify-between">{children}</div>
        </Suspense>
      </div>
    </>
  );
}
